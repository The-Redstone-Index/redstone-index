<script lang="ts">
	import { getSearchedSpecs } from '$lib/api.js';
	import SpecificationCard from '$lib/display/SpecificationCard.svelte';
	import { isModeratorOrAdmin } from '$lib/utils.js';
	import { Paginator, getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data;

	let { specs, count, supabase, session } = data;
	$: ({ specs, count, supabase, session } = data);

	let searchTerms = '';
	let offset = 0;
	let limit = 50;

	async function handleSearch() {
		const [newSpecs, error, newCount] = await getSearchedSpecs(
			supabase,
			searchTerms || null,
			offset,
			limit
		);
		if (error) {
			if (error.code === 'PGRST103') {
				offset = 0;
				return handleSearch();
			}
			return toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		}
		specs = newSpecs;
		count = newCount;
	}

	async function onAmountChange(e: CustomEvent) {
		const newAmount = e.detail as number;
		limit = newAmount;
		handleSearch();
	}

	async function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
		handleSearch();
	}
</script>

<svelte:head>
	<title>Specifications - The Redstone Index</title>
	<meta name="description" content="Find specifications for builds on The Redstone Index." />
</svelte:head>

<div class="container min-h-[calc(100vh-12rem)] mx-auto p-4 mb-5 flex flex-col gap-10 mt-10">
	<!-- Heading -->
	<div class="flex justify-between items-center">
		<h1 class="h1">Specifications</h1>
		{#if isModeratorOrAdmin(session)}
			<div>
				<a href="/specifications/new" class="btn btn-sm variant-filled-primary">
					<i class="fa-solid fa-plus mr-2" />
					Create a new spec
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
		{#each specs as spec}
			<SpecificationCard {spec} />
		{/each}
	</div>

	<!-- Pagination -->
	<div class="flex-1" />
	<Paginator
		settings={{ amounts: [25, 50, 100], page: 0, limit: 50, size: count }}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
