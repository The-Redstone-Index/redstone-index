<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { formatCommentDate } from '$lib/utils';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import CommentEllipsesMenu from './CommentEllipsesMenu.svelte';
	import CommentQuote from './CommentQuote.svelte';

	export let comment: CommentDetails;
	export let highlight = false;
	export let selfUser: SelfUser | undefined;

	const supabase = $supabaseStore;
	const dispatch = createEventDispatcher();

	let clientWidth: number;

	let commentEllipsesMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'commentEllipsesMenuPopup-' + crypto.randomUUID()
	};
</script>

<CommentEllipsesMenu
	target={commentEllipsesMenuPopupSettings.target}
	{selfUser}
	{comment}
	on:deleteComment={() => {
		comment.deleted = true;
	}}
/>

<div class="grid grid-cols-[3.5rem_auto_3.5rem] group">
	<!-- Avatar -->
	{#if comment.deleted}
		<Avatar width="w-12" class="h-12" initials={'-'} />
	{:else}
		<a href={`/users/${comment.author.numeric_id}`} target="_blank">
			<Avatar
				width="w-12"
				class="h-12"
				src={getAvatarUrl(supabase, comment.author.avatar_path)}
				initials={comment.author.username.toLocaleUpperCase()}
			/>
		</a>
	{/if}

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
				{#if comment.deleted}
					<div class="text-sm">[deleted]</div>
				{:else}
					<a
						href={`/users/${comment.author.numeric_id}`}
						class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
						target="_blank"
					>
						{comment.author.username}
					</a>
				{/if}
			</p>
			<small class="opacity-50">{formatCommentDate(new Date(comment.created_at))}</small>
		</header>
		<!-- Content -->
		<div class="max-h-96 overflow-auto">
			{#if comment.deleted}
				<div class="opacity-70 text-sm">[deleted]</div>
			{:else}
				{#key clientWidth}
					<AutoResizeTextarea value={comment.content} readonly unstyled rows={1} />
				{/key}
			{/if}
		</div>
	</div>

	<!-- Side action buttons -->
	<div class="flex flex-col items-end gap-1">
		{#if selfUser}
			<button
				class="btn-icon btn-icon-sm hover:variant-soft invisible group-hover:visible aspect-square w-10 h-10"
				use:popup={commentEllipsesMenuPopupSettings}
			>
				<i class="fa-solid fa-ellipsis-vertical" />
			</button>
		{/if}
		{#if highlight}
			<a
				href="?"
				class="btn-icon btn-icon-sm hover:variant-soft invisible group-hover:visible aspect-square w-10 h-10"
			>
				<i class="fa-solid fa-close" />
			</a>
		{/if}
	</div>

	<!-- Action buttons -->
	<div />
	<div class="flex gap-3 px-3 text-sm">
		<button on:click={() => dispatch('reply', comment)}>Reply</button>
	</div>
</div>
