<script lang="ts">
	import { page } from '$app/stores';
	import { isModeratorOrAdmin } from '$lib/utils.js';

	export let data;

	let { spec, session } = data;
	$: ({ spec, session } = data);
</script>

<svelte:head>
	<title>{spec.name} - The Redstone Index</title>
	<meta name="description" content="See tags for builds on The Redstone Index." />
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5 flex flex-col gap-10 mt-10">
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Search for more specs
	</a>
	<!-- Name -->
	<div class="flex gap-5 items-center">
		<h1 class="h1">
			<i class="fa-solid fa-tag mr-2 opacity-50" />
			{spec.name}
		</h1>
		{#if isModeratorOrAdmin(session)}
			<a href={`${$page.url}/edit`} class="anchor">
				<i class="fas fa-pencil no-underline" />
				<span>Edit</span>
			</a>
		{/if}
	</div>
	<!-- Details -->
	<a class="anchor" href="/search?specs={spec.id}">
		<i class="fa-solid fa-magnifying-glass mr-1" />
		Used in {spec.usage_count} builds
	</a>
	<div>
		<h2 class="h3 mb-3">Description</h2>
		<div>
			{#if spec.description}
				{spec.description}
			{:else}
				<span class="opacity-40">No description provided</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Keywords</h2>
		<div>
			{#if spec.keywords}
				{spec.keywords}
			{:else}
				<span class="opacity-40">No keywords provided</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Unit</h2>
		<div>
			{#if spec.unit}
				{spec.unit}
			{:else}
				<span class="opacity-40">No unit provided</span>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="h3 mb-3">Created by</h2>
		<div>
			{#if spec.author}
				<span>
					<a href="/users/{spec.author.numeric_id}" class="anchor">
						{spec.author.username}
					</a>
				</span>
			{:else}
				<span class="opacity-40">(No user)</span>
			{/if}
			<span>on {new Date(spec.created_at).toLocaleDateString()}</span>
		</div>
	</div>
</div>
