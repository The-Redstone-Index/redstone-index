<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let comments: {
		message: string;
		username: string;
		avatar: string;
		time: Date;
	}[];

	let newComment: string;
	let commentTextAreaEl: HTMLTextAreaElement;
	$: if (newComment && commentTextAreaEl) {
		commentTextAreaEl.style.height = '';
		commentTextAreaEl.style.height = commentTextAreaEl.scrollHeight + 2 + 'px';
	}
</script>

<section id="#comments" class="flex flex-col gap-5">
	<!-- Input -->
	<form class="flex gap-3 items-center" on:submit|preventDefault>
		<textarea
			name="newComment"
			id="newComment"
			class="textarea resize-none"
			rows="3"
			placeholder="Write a comment..."
			bind:this={commentTextAreaEl}
			bind:value={newComment}
		/>
		<button class="btn-icon variant-filled-primary h-min aspect-square">
			<i class="fa-solid fa-paper-plane" />
		</button>
	</form>
	<!-- Comments -->
	<div id="comments" class="flex flex-col gap-8">
		{#each comments as comment}
			<div class="flex flex-col gap-2 group">
				<div class="flex gap-5 items-center">
					<Avatar width="w-8" rounded="rounded-full" src={comment.avatar} class="">
						{comment.username[0].toLocaleUpperCase()}
					</Avatar>
					<a
						href={`/user/${comment.username}`}
						class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
					>
						{comment.username}
					</a>
					<div class="font-thin text-sm whitespace-nowrap">
						{comment.time.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric'
						})}
					</div>
					<div class="flex-1 justify-end flex-grow flex invisible group-hover:visible">
						<button class="btn-icon">
							<i class="fa-solid fa-ellipsis-vertical" />
						</button>
					</div>
				</div>
				<div>
					{comment.message}
				</div>
			</div>
		{/each}
	</div>
</section>
