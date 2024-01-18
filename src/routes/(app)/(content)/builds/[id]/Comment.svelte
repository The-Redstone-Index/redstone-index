<script lang="ts">
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let comment: CommentDetails;
	export let highlight = false;

	const supabase = $supabaseStore;

	function formatDate(date: Date) {
		const now = new Date();
		const yesterday = new Date(now);
		yesterday.setDate(now.getDate() - 1);
		// Return string format
		if (isSameDay(date, now)) return 'Today @ ' + formatTime(date);
		else if (isSameDay(date, yesterday)) return 'Yesterday @ ' + formatTime(date);
		else return formatDateFull(date);

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
</script>

<div class="grid grid-cols-[3.5rem_auto_3.5rem] group">
	<!-- Avatar -->
	<Avatar
		width="w-12"
		class="h-12"
		src={getAvatarUrl(supabase, comment.author.avatar_path)}
		initials={comment.author.username.toLocaleUpperCase()}
	/>
	<!-- Comment Body -->
	<div
		class="card p-4 h-fit w-auto variant-soft rounded-tl-none space-y-2 group outline-1 outline-primary-500/50"
		class:outline={highlight}
	>
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
			<a href={`?comment=${comment.parent.id}`}>
				<blockquote class="blockquote bg-secondary-500/10 p-3 group/replying">
					<header class="flex justify-between items-center mb-2">
						<div>
							<span class="opacity-70">Replying to</span>
							<a href={`/users/${comment.parent.author.numeric_id}`} class="anchor">
								@{comment.parent.author.username}
							</a>
							<small class="opacity-50 ml-3">
								{formatDate(new Date(comment.parent.created_at))}
							</small>
						</div>
						<div class="opacity-50 group-hover/replying:opacity-70 text-sm">
							View Comment <i class="fa-solid fa-chevron-right" />
						</div>
					</header>
					{#each lines.slice(0, 1) as line}
						<div class="whitespace-pre-line">{line}</div>
					{/each}
					{#if lines.length > 1}...{/if}
				</blockquote>
			</a>
		{/if}
		<!-- Content -->
		<div class="whitespace-pre-line">{comment.content}</div>
	</div>
	<!-- Ellipses menu -->
	<div class="flex justify-end">
		<button
			class="btn-icon btn-icon-sm focus:variant-soft invisible group-hover:visible aspect-square w-10 h-10"
		>
			<i class="fa-solid fa-ellipsis-vertical" />
		</button>
	</div>
	<!-- Like/Reply action buttons -->
	<div />
	<div class="flex gap-3 px-3 text-sm">
		<button>
			<i class="far fa-thumbs-up" />
			(TODO)
		</button>
		<button>Reply</button>
	</div>
</div>
