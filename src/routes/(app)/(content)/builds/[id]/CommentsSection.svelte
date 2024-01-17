<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getComments, getSingleComment } from '$lib/supabase-api/comments';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';

	export let buildId: number;
	export let userId: string | undefined;
	export let offset: number = 0;
	export let limit: number = 10;
	export let highlightedCommentId: number | undefined = undefined;

	const supabase = $supabaseStore;
	const toastStore = getToastStore();

	// Displayed comments

	$: highlightedCommentQuery =
		highlightedCommentId && getSingleComment(supabase, highlightedCommentId);

	$: commentsQuery = getComments(supabase, { offset, limit, buildId }).then(([data, error]) => {
		if (error || !data) throw error;
		console.log(data);
		return data;
	});

	function formatDate(date: Date) {
		const now = new Date();
		const yesterday = new Date(now);
		yesterday.setDate(now.getDate() - 1);

		if (isSameDay(date, now)) {
			return 'Today @ ' + formatTime(date);
		} else if (isSameDay(date, yesterday)) {
			return 'Yesterday @ ' + formatTime(date);
		} else {
			return formatDateFull(date);
		}

		function isSameDay(date1: Date, date2: Date) {
			return (
				date1.getFullYear() === date2.getFullYear() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getDate() === date2.getDate()
			);
		}

		function formatTime(date: Date) {
			return date
				.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
				.toUpperCase();
		}

		function formatDateFull(date: Date) {
			return date
				.toLocaleString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					hour12: true
				})
				.toUpperCase();
		}
	}

	// Making comments

	let content: string;
	let replyingTo: number | undefined;

	async function submit() {
		if (!userId) throw 'You must be logged in to make a comment!';
		const { error } = await supabase.from('comments').insert({
			user_id: userId,
			build_id: buildId,
			replying_to: replyingTo,
			content: content
		});
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
	}
</script>

<section id="#comments" class="flex flex-col gap-5">
	<!-- Input -->
	<div class="grid grid-cols-[3.5rem_auto_3.5rem]">
		<div />
		<blockquote class="blockquote">
			<div>Replying to @plasmatech8</div>
		</blockquote>
	</div>
	<form class="grid grid-cols-[3.5rem_auto_3.5rem]" on:submit|preventDefault>
		<div />
		<div class="w-full">
			<AutoResizeTextarea
				name="newComment"
				id="newComment"
				class="my-1"
				rows={3}
				placeholder="Write a comment..."
				bind:value={content}
				disabled={!userId}
			/>
		</div>
		<div class="justify-end flex items-center">
			<button
				class="btn-icon variant-filled-primary h-min aspect-square"
				type="button"
				on:click={submit}
			>
				<i class="fa-solid fa-paper-plane" />
			</button>
		</div>
	</form>
	<!-- Comments -->
	<div id="comments" class="flex flex-col gap-3">
		{#await commentsQuery then comments}
			{#each comments as comment}
				<div class="grid grid-cols-[3.5rem_auto_3.5rem] group">
					<Avatar
						width="w-12"
						class="h-12"
						src={getAvatarUrl(supabase, comment.author.avatar_path)}
						initials={comment.author.username.toLocaleUpperCase()}
					/>
					<div class="card p-4 h-fit w-auto variant-soft rounded-tl-none space-y-2 group">
						<header class="flex justify-between items-center">
							<p class="font-bold">
								<a
									href={`/user/${comment.author.id}`}
									class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
								>
									{comment.author.username}
								</a>
							</p>
							<small class="opacity-50">{formatDate(new Date(comment.created_at))}</small>
						</header>
						<!-- Replying to comment details -->
						{#if comment.parent}
							{@const lines = comment.parent.content.split('\n')}
							<blockquote class="blockquote">
								<header>
									Replying to
									<a href={`/users/${comment.parent.author.numeric_id}`} class="anchor">
										@{comment.parent.author.username}
									</a>
									<small class="opacity-50 ml-3">
										{formatDate(new Date(comment.parent.created_at))}
									</small>
								</header>
								{#each lines.slice(0, 1) as line}
									<div class="whitespace-pre-line">{line}</div>
								{/each}
								{#if lines.length > 1}...{/if}
							</blockquote>
						{/if}
						<!-- Comment content -->
						<div class="whitespace-pre-line">{comment.content}</div>
					</div>
					<div class="flex justify-end">
						<button
							class="btn-icon btn-icon-sm focus:variant-soft invisible group-hover:visible aspect-square w-10 h-10"
						>
							<i class="fa-solid fa-ellipsis-vertical" />
						</button>
					</div>
				</div>
			{/each}
		{/await}
	</div>
</section>
