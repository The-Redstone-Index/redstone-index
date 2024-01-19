<script lang="ts">
	import { supabaseStore } from '$lib/stores';
	import { deleteComment } from '$lib/supabase-api/comments';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let target: string;
	export let selfUser: Tables<'users'> | undefined;
	export let comment: CommentDetails;

	const dispatch = createEventDispatcher();

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const supabase = $supabaseStore;

	function openReportUserModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Report User',
			body: 'Please provide a brief explanation of why you are reporting this user',
			valueAttr: { type: 'text', minlength: 3, maxlength: 1000, required: true },
			response: (r) => {
				if (r) {
					// TODO
					alert('FEATURE NOT IMPLEMENTED');
				}
			}
		});
	}

	async function handleDeleteComment() {
		const error = await deleteComment(supabase, comment);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		toastStore.trigger({
			message: `<i class="fas fa-check mr-1"></i> Comment deleted!`,
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		dispatch('deleteComment');
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
					Report Comment
				</button>
			</li>
		{/if}
		{#if selfUser && (selfUser.role === 'administrator' || selfUser.role === 'moderator' || selfUser.id === comment.user_id)}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={handleDeleteComment}
				>
					<i class="fas fa-level-up-alt w-6 mr-2" />
					Delete Comment
					{#if selfUser?.id !== comment.user_id}
						<small>(using moderator privileges)</small>
					{/if}
				</button>
			</li>
		{/if}
	</ul>
</nav>
