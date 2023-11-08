<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SpecificationCard from '$lib/display/SpecificationCard.svelte';
	import { isModeratorOrAdmin } from '$lib/utils.js';
	import { Paginator, getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data;

	let { specs, count, query, offset, limit, session, error } = data;
	$: ({ specs, count, query, offset, limit, session, error } = data);

	let searchQuery = query;

	$: if (error && browser) {
		if (error.code === 'PGRST103') {
			offset = 0;
			handleSearch();
		} else {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		}
	}

	async function handleSearch() {
		const newSearchParams = $page.url.searchParams;
		if (searchQuery) newSearchParams.set('query', searchQuery);
		else newSearchParams.delete('query');
		newSearchParams.set('offset', offset.toString());
		newSearchParams.set('limit', limit.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
	}

	async function onAmountChange(e: CustomEvent) {
		const newAmount = e.detail as number;
		limit = newAmount;
		const newSearchParams = $page.url.searchParams;
		newSearchParams.set('limit', limit.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
	}

	async function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
		const newSearchParams = $page.url.searchParams;
		newSearchParams.set('offset', offset.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
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
		<input type="search" class="input" placeholder="Search tags..." bind:value={searchQuery} />
		<button class="btn-icon variant-filled-primary" type="submit">
			<i class="fa-solid fa-magnifying-glass" />
		</button>
	</form>

	<!-- List of specs -->
	{#if specs}
		{#if specs.length === 0}
			<div class="grid place-items-center h-96 opacity-50">No specifications found!</div>
		{:else}
			<div class="flex gap-5 flex-wrap">
				{#each specs as spec}
					<SpecificationCard {spec} />
				{/each}
			</div>
		{/if}
	{:else}
		<div class="grid place-items-center h-96">
			<i class="fa-solid fa-circle-exclamation w-60 text-8xl animate-pulse text-error-600" />
		</div>
	{/if}

	<!-- Pagination -->
	<div class="flex-1" />
	<Paginator
		settings={{ amounts: [25, 50, 100], page: Math.floor(offset / limit), limit, size: count }}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
