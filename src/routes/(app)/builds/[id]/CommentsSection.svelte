<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let comments: {
		message: string;
		username: string;
		avatar: string;
		time: Date;
	}[];

	let newComment: string;

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
</script>

<section id="#comments" class="flex flex-col gap-5">
	<!-- Input -->
	<form class="flex gap-3 items-center ml-14" on:submit|preventDefault>
		<AutoResizeTextarea
			name="newComment"
			id="newComment"
			class="my-1"
			rows="3"
			placeholder="Write a comment..."
			bind:value={newComment}
		/>
		<button class="btn-icon variant-filled-primary h-min aspect-square">
			<i class="fa-solid fa-paper-plane" />
		</button>
	</form>
	<!-- Comments -->
	<div id="comments" class="flex flex-col gap-8">
		{#each comments as comment}
			<div class="flex flex-col gap-2 group mr-12">
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<div class="flex flex-col gap-1 items-center">
						<Avatar
							width="w-12"
							src={comment.avatar}
							:initials={comment.username[0].toLocaleUpperCase()}
						/>
						<button class="btn-icon btn-icon-sm focus:variant-soft invisible group-hover:visible">
							<i class="fa-solid fa-ellipsis-vertical" />
						</button>
					</div>
					<div class="card p-4 h-fit variant-soft rounded-tl-none space-y-2 group">
						<header class="flex justify-between items-center">
							<p class="font-bold">
								<a
									href={`/user/${comment.username}`}
									class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
								>
									{comment.username}
								</a>
							</p>
							<small class="opacity-50">{formatDate(comment.time)}</small>
						</header>
						<p>{comment.message}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
