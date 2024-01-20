<script lang="ts">
	import { supabaseStore } from '$lib/stores';
	import { submitUserReport } from '$lib/supabase-api/reports';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let target: string;
	export let selfUser: Tables<'users'> | undefined;
	export let build: BuildDetails;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const supabase = $supabaseStore;

	function openReportUserModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Report User Build',
			body: 'Please provide a brief explanation of why you are reporting this user',
			valueAttr: { type: 'text', minlength: 3, maxlength: 1000, required: true },
			response: async (r) => {
				if (r) {
					const info = {
						reportedUserId: build.user_id,
						reporterUserId: selfUser?.id as string,
						link: `/builds/${build.id}`,
						topic: 'Reported Build',
						reason: r
					};
					const error = await submitUserReport(supabase, info);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Report Submitted!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
				}
			}
		});
	}
</script>

<nav class="list-nav card p-1 shadow-xl z-50" data-popup={target}>
	<ul>
		{#if selfUser}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={openReportUserModal}
				>
					<i class="fas fa-flag w-6 mr-2" />
					Report Build
				</button>
			</li>
		{/if}
		<!-- {#if selfUser && (selfUser.role === 'administrator' || selfUser.role === 'moderator')}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={handleDeleteBuild}
				>
					<i class="fas fa-trash-can w-6 mr-2" />
					Delete Build
						<small>(using moderator privileges)</small>
				</button>
			</li>
		{/if} -->
	</ul>
</nav>
