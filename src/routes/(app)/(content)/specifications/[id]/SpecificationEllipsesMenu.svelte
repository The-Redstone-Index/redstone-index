<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabaseStore } from '$lib/stores';
	import { submitUserReport } from '$lib/supabase-api/reports';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let target: string;
	export let selfUser: Tables<'users'> | undefined;
	export let specification: SpecificationDetails;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const supabase = $supabaseStore;

	function openReportSpecModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Report Specification',
			body: 'Please provide a brief explanation of why you are reporting this user',
			valueAttr: { type: 'text', minlength: 3, maxlength: 1000, required: true },
			response: async (r) => {
				if (r) {
					const info = {
						reportedUserId: specification.created_by as string,
						reporterUserId: selfUser?.id as string,
						link: `/specifications/${specification.id}`,
						topic: 'Reported Specification',
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

	function openRecommendModal() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Add to Recommended',
			body: 'Set this specification to recommended category.',
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('specifications')
						.update({ recommended: true })
						.eq('id', specification.id);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Specification Updated!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
				}
				invalidateAll();
			}
		});
	}

	function openUnRecommendModal() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Remove from Recommended',
			body: 'Remove this specification from the recommended category.',
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('specifications')
						.update({ recommended: false })
						.eq('id', specification.id);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Specification Updated!`,
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
					on:click={openReportSpecModal}
				>
					<i class="fas fa-flag w-6 mr-2" />
					Report Specification
				</button>
			</li>
		{/if}
		{#if selfUser && (selfUser.role === 'administrator' || selfUser.role === 'moderator')}
			<li>
				{#if specification.recommended}
					<button
						class="focus:outline-none w-full text-left"
						type="button"
						on:click={openUnRecommendModal}
					>
						<i class="fas fa-trash-can w-6 mr-2" />
						Remove from Recommended
						<small>(using moderator privileges)</small>
					</button>
				{:else}
					<button
						class="focus:outline-none w-full text-left"
						type="button"
						on:click={openRecommendModal}
					>
						<i class="fas fa-trash-can w-6 mr-2" />
						Add to Recommended
						<small>(using moderator privileges)</small>
					</button>
				{/if}
			</li>
		{/if}
	</ul>
</nav>
