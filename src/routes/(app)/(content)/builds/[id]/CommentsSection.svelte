<script lang="ts">
	import InputLengthIndicator from '$lib/InputLengthIndicator.svelte';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getComments, getSingleComment } from '$lib/supabase-api/comments';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Comment from './Comment.svelte';
	import CommentQuote from './CommentQuote.svelte';

	export let buildId: number;
	export let userId: string | undefined;
	export let offset: number = 0;
	export let limit: number = 20;
	export let highlightedCommentId: number | undefined = undefined;

	const supabase = $supabaseStore;
	const toastStore = getToastStore();
	const dispatch = createEventDispatcher();

	let form: HTMLFormElement;
	let highlightedCommentContainerEl: HTMLDivElement;

	// Displayed comments

	$: highlightedCommentQuery =
		highlightedCommentId &&
		getSingleComment(supabase, highlightedCommentId).then(([data, error]) => {
			if (error || !data) throw error;
			return data;
		});

	$: commentsQuery = getComments(supabase, { offset, limit, buildId }).then(([data, error]) => {
		if (error || !data) throw error;
		return data;
	});

	onMount(() => {
		handleScrollToHighlightedComment();
	});

	// Making comments

	let content: string = '';
	let replyingTo: CommentDetails | undefined;

	function handleScrollToHighlightedComment() {
		setTimeout(() => {
			if (highlightedCommentQuery) {
				highlightedCommentQuery.finally(() => {
					highlightedCommentContainerEl.scrollIntoView({
						inline: 'center',
						block: 'nearest',
						behavior: 'smooth'
					});
				});
			}
		}, 100);
	}

	function handleOnReply(event: CustomEvent) {
		replyingTo = event.detail as CommentDetails;
		highlightedCommentId = undefined;
		form.querySelector('textarea')?.focus();
	}

	function handleHotkey(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			submit();
		}
	}

	async function submit() {
		if (!userId) throw 'You must be logged in to make a comment!';
		const { data, error } = await supabase
			.from('comments')
			.insert({
				user_id: userId,
				build_id: buildId,
				replying_to: replyingTo?.id,
				content: content
			})
			.select('id')
			.single();
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		toastStore.trigger({
			message: `<i class="fas fa-check mr-1"></i> Added comment!`,
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		content = '';
		replyingTo = undefined;
		highlightedCommentId = data.id;
		dispatch('commented');
	}
</script>

<section id="#comments" class="flex flex-col gap-4">
	<!-- Input -->
	{#if replyingTo}
		<div class="grid grid-cols-[3.5rem_auto_3.5rem]" transition:slide>
			<div />
			<CommentQuote
				comment={replyingTo}
				on:close={() => (replyingTo = undefined)}
				showCloseButton
			/>
		</div>
	{/if}
	<form
		class="grid grid-cols-[3.5rem_auto_3.5rem]"
		on:submit|preventDefault={submit}
		bind:this={form}
	>
		<div />
		<div class="w-full">
			<AutoResizeTextarea
				name="newComment"
				id="newComment"
				class="my-1"
				rows={3}
				placeholder={`Write a ${replyingTo ? 'reply' : 'comment'}...`}
				bind:value={content}
				disabled={!userId}
				on:keydown={handleHotkey}
				minlength={1}
				maxlength={1000}
				required
			/>
			<InputLengthIndicator text={content} minLength={1} maxLength={1000} />
		</div>
		<div class="justify-end flex items-center">
			<button
				class="btn-icon variant-filled-primary h-min aspect-square -translate-y-3"
				type="submit"
			>
				<i class="fa-solid fa-paper-plane" />
			</button>
		</div>
	</form>
	<!-- Highlighted comment -->
	{#if highlightedCommentQuery}
		<div bind:this={highlightedCommentContainerEl}>
			<div class="ml-16 font-ligh text-sm text-primary-500">Highlighted comment:</div>
			{#await highlightedCommentQuery then comment}
				<Comment
					{comment}
					highlight
					on:reply={handleOnReply}
					on:quoteclick={handleScrollToHighlightedComment}
				/>
			{/await}
		</div>
	{/if}
	<!-- Comments -->
	<div class="flex flex-col gap-3">
		{#await commentsQuery then comments}
			{#each comments as comment}
				<Comment
					{comment}
					on:reply={handleOnReply}
					on:quoteclick={handleScrollToHighlightedComment}
				/>
			{/each}
		{/await}
	</div>
</section>
