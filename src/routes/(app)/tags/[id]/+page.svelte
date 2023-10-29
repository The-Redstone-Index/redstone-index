<script lang="ts">
	import { page } from '$app/stores';
	import { isModeratorOrAdmin } from '$lib/utils.js';

	export let data;

	let { tag, session } = data;
	$: ({ tag, session } = data);
</script>

<svelte:head>
	<title>{tag.name} - The Redstone Index</title>
	<meta name="description" content="See tags for builds on The Redstone Index." />
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5 flex flex-col gap-10 mt-10">
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Search for more tags
	</a>
	<!-- Name -->
	<div class="flex gap-5 items-center">
		<h1 class="h1">
			<i class="fa-solid fa-tag mr-2 opacity-50" />
			{tag.name}
		</h1>
		{#if isModeratorOrAdmin(session)}
			<a href={`${$page.url}/edit`} class="anchor">
				<i class="fas fa-pencil no-underline" />
				<span>Edit</span>
			</a>
		{/if}
	</div>
	<!-- Details -->
	<div>
		<h2 class="h3 mb-3">Description</h2>
		<div>{tag.description}</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Keywords</h2>
		<div>
			{#if tag.keywords}
				{tag.keywords}
			{:else}
				<span class="opacity-40">No keywrds provided</span>
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
				<div>
					<a href="/users/{tag.author.numeric_id}" class="anchor">
						{tag.author.username}
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
