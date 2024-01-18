<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { formatCommentDate } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let comment: Tables<'comments'> & { author: Tables<'users'> };
	export let showCloseButton = false;

	const dispatch = createEventDispatcher();

	let clientWidth: number;
</script>

<a href={`?comment=${comment.id}`} on:click={() => dispatch('quoteclick')}>
	<blockquote class="blockquote bg-secondary-500/10 p-3 group/replying" bind:clientWidth>
		<header class="flex justify-between items-center mb-2 text-sm">
			<div>
				<span class="opacity-70">Replying to</span>
				<a href={`/users/${comment.author.numeric_id}`} class="anchor">
					@{comment.author.username}
				</a>
				<small class="opacity-50 ml-3">
					{formatCommentDate(new Date(comment.created_at))}
				</small>
			</div>
			<div class="opacity-50 group-hover/replying:opacity-70 flex gap-3 items-center">
				<span class="">
					<small>
						Click to View
						<i class="fa-solid fa-chevron-right ml-1" />
					</small>
				</span>
				{#if showCloseButton}
					<button class="btn-icon hover:variant-soft-surface" on:click={() => dispatch('close')}>
						<i class="fa-solid fa-close" />
					</button>
				{/if}
			</div>
		</header>
		<div class="max-h-20 overflow-auto">
			{#key clientWidth}
				<AutoResizeTextarea
					value={comment.content}
					readonly
					unstyled
					rows={1}
					class="pointer-events-none"
				/>
			{/key}
		</div>
	</blockquote>
</a>
