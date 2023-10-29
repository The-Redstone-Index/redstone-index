<script lang="ts">
	import { getSearchedTagDetails } from '$lib/api.js';
	import TagCard from '$lib/display/TagCard.svelte';
	import { isModeratorOrAdmin } from '$lib/utils.js';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data;

	let { tags, supabase, session } = data;
	$: ({ tags, supabase, session } = data);

	let searchTerms = '';

	async function handleSearch() {
		const [newTags, error] = await getSearchedTagDetails(supabase, searchTerms || null);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		}
		tags = newTags;
		console.log(newTags);
	}
</script>

<svelte:head>
	<title>Tags - The Redstone Index</title>
	<meta name="description" content="See tags for builds on The Redstone Index." />
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5 flex flex-col gap-10 mt-10">
	<div class="flex justify-between items-center">
		<h1 class="h1">Tags</h1>
		{#if isModeratorOrAdmin(session)}
			<div>
				<a href="/tags/new" class="btn btn-sm variant-filled-primary">
					<i class="fa-solid fa-plus mr-2" />
					Create a new tag
				</a>
			</div>
		{/if}
	</div>

	<!-- Search input -->
	<form class="flex gap-3" on:submit|preventDefault={handleSearch}>
		<input type="search" class="input" placeholder="Search tags..." bind:value={searchTerms} />
		<button class="btn-icon variant-filled-primary" type="submit">
			<i class="fa-solid fa-magnifying-glass" />
		</button>
	</form>

	<!-- List of tags -->
	<div class="flex gap-5 flex-wrap">
		{#each tags as tag}
			<TagCard {tag} />
		{/each}
	</div>
</div>
