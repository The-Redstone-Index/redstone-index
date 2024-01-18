<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { formatCommentDate } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let comment: Tables<'comments'> & { author: Tables<'users'> };
	export let showCloseButton = false;

	const dispatch = createEventDispatcher();

	let clientWidth: number;

	function truncateComment(
		content: string,
		{ maxChars = 150, maxLines = 3 }: { maxChars?: number; maxLines?: number } = {}
	) {
		const firstXCharacters = content.slice(0, maxChars);
		const lines = firstXCharacters.split('\n');
		const firstXLines = lines.slice(0, 3).join('\n');
		const wasTruncated = content.length > maxChars || lines.length > maxLines;
		return firstXLines + (wasTruncated ? '...' : '');
	}
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
			<div class="opacity-50 group-hover/replying:opacity-70">
				{#if showCloseButton}
					<button class="btn-icon hover:variant-soft-surface" on:click={() => dispatch('close')}>
						<i class="fa-solid fa-close" />
					</button>
				{:else}
					<i class="fa-solid fa-chevron-right" />
				{/if}
			</div>
		</header>
		{#key clientWidth}
			<AutoResizeTextarea
				value={truncateComment(comment.content)}
				readonly
				unstyled
				rows={1}
				class="pointer-events-none"
			/>
		{/key}
	</blockquote>
</a>
