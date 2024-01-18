<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { formatCommentDate } from '$lib/utils';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import CommentQuote from './CommentQuote.svelte';

	export let comment: CommentDetails;
	export let highlight = false;

	const supabase = $supabaseStore;
	const dispatch = createEventDispatcher();

	let clientWidth: number;
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
		class="card p-4 h-fit variant-soft rounded-tl-none space-y-2 group outline-1 outline-primary-500/50"
		class:outline={highlight}
		bind:clientWidth
	>
		<!-- Replying to comment details -->
		{#if comment.parent}
			<CommentQuote comment={comment.parent} on:quoteclick />
		{/if}
		<!-- Header -->
		<header class="flex justify-between items-center">
			<p class="font-bold">
				<a
					href={`/user/${comment.author.id}`}
					class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
				>
					{comment.author.username}
				</a>
			</p>
			<small class="opacity-50">{formatCommentDate(new Date(comment.created_at))}</small>
		</header>
		<!-- Content -->
		{#key clientWidth}
			<AutoResizeTextarea value={comment.content} readonly unstyled rows={1} />
		{/key}
	</div>

	<!-- Ellipses menu -->
	<div class="flex justify-end">
		<button
			class="btn-icon btn-icon-sm focus:variant-soft invisible group-hover:visible aspect-square w-10 h-10"
		>
			<i class="fa-solid fa-ellipsis-vertical" />
		</button>
	</div>

	<!-- Action buttons -->
	<div />
	<div class="flex gap-3 px-3 text-sm">
		<button on:click={() => dispatch('reply', comment)}>Reply</button>
	</div>
</div>
