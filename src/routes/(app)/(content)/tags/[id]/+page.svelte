<script lang="ts">
	import { page } from '$app/stores';
	import { enhanceTextView, isModeratorOrAdmin } from '$lib/utils.js';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import TagEllipsesMenu from './TagEllipsesMenu.svelte';

	export let data;

	let { tag, session, user } = data;
	$: ({ tag, session, user } = data);

	let tagEllipsesMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'tagEllipsesMenuPopup'
	};
</script>

<svelte:head>
	<title>{tag.name} - The Redstone Index</title>
	<meta name="description" content="See tags for builds on The Redstone Index." />
</svelte:head>

<TagEllipsesMenu selfUser={user} {tag} target={tagEllipsesMenuPopupSettings.target} />

<div class="container h-full mx-auto justify-center p-4 mb-5 flex flex-col gap-10 mt-10">
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Search for more tags
	</a>
	<!-- Name -->
	<div class="flex gap-5 items-center">
		<h1 class="h1">
			<div class="relative inline-block">
				<i class="fa-solid fa-tag mr-2 opacity-50" />
				{#if tag.recommended}
					<i class="fas fa-star absolute text-lg top-0 right-0 text-yellow-500" />
				{/if}
			</div>
			{tag.name}
		</h1>
		{#if isModeratorOrAdmin(session)}
			<a href={`${$page.url}/edit`} class="anchor">
				<i class="fas fa-pencil no-underline" />
				<span>Edit</span>
			</a>
		{/if}
		<div class="flex-1" />
		{#if user}
			<button class="btn-icon hover:variant-soft h-fit" use:popup={tagEllipsesMenuPopupSettings}>
				<i class="fa-solid fa-ellipsis-vertical" />
			</button>
		{/if}
	</div>
	<!-- Details -->
	<a class="anchor" href="/search?tags={tag.id}">
		<i class="fa-solid fa-magnifying-glass mr-1" />
		{tag.usage_count > 0
			? `Used in ${tag.usage_count} build${tag.usage_count !== 1 ? 's' : ''}`
			: 'Not used in any builds'}
	</a>
	<div>
		<h2 class="h3 mb-3">Description</h2>
		<div class="whitespace-pre-line" use:enhanceTextView>
			{#if tag.description}
				{tag.description}
			{:else}
				<span class="opacity-40">No description provided</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Keywords</h2>
		<div>
			{#if tag.keywords}
				{tag.keywords}
			{:else}
				<span class="opacity-40">No keywords provided</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Parent</h2>
		<div>
			{#if tag.parent}
				<a href="/tags/{tag.parent.id}" class="anchor">{tag.parent.name} (ID: {tag.parent_id})</a>
			{:else}
				<span class="opacity-40">No parent tag specified</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Created by</h2>
		<div>
			{#if tag.author}
				<span>
					<a href="/users/{tag.author.numeric_id}" class="anchor">
						{tag.author.username}
					</a>
				</span>
			{:else}
				<span class="opacity-40">(No user)</span>
			{/if}
			<span>on {new Date(tag.created_at).toLocaleDateString()}</span>
		</div>
	</div>
</div>
