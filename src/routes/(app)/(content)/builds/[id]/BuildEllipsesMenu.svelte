<script lang="ts">
	import { invalidateAll } from '$app/navigation';
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

	function openRemoveBuildModal() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove Build',
			body: `<p>Remove visibility of this build on the index.</p>
				<br>
				<p>(This build is inappropriate or the author has asked for removal)</p>`,
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('builds')
						.update({ removed: true })
						.eq('id', build.id);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Build Updated!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
					build.removed = !build.removed;
				}
				invalidateAll();
			}
		});
	}

	function openUnRemoveBuildModal() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Un-Remove',
			body: `<p>Make this build visible again on the index.</p>
				<br>
				<p>(Build was miscategorised or is no longer deemed inappropriate content)</p>`,
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('builds')
						.update({ removed: false })
						.eq('id', build.id);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Build Un-Removed!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
					invalidateAll();
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
		{#if selfUser && (selfUser.role === 'administrator' || selfUser.role === 'moderator')}
			<li>
				{#if build.removed}
					<button
						class="focus:outline-none w-full text-left"
						type="button"
						on:click={openUnRemoveBuildModal}
					>
						<i class="fas fa-trash-can w-6 mr-2" />
						Un-Remove Build
						<small>(using moderator privileges)</small>
					</button>
				{:else}
					<button
						class="focus:outline-none w-full text-left"
						type="button"
						on:click={openRemoveBuildModal}
					>
						<i class="fas fa-trash-can w-6 mr-2" />
						Remove Build
						<small>(using moderator privileges)</small>
					</button>
				{/if}
			</li>
		{/if}
	</ul>
</nav>
