<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import BuildCard from '$lib/display/BuildCard.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
	import { Paginator, getToastStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import SearchFilterPanel from './SearchFilterPanel.svelte';

	const toastStore = getToastStore();

	export let data;
	let { builds, count, offset, limit, supabase, error, filters } = data;
	$: ({ builds, count, offset, limit, supabase, error, filters } = data);

	let resources: Resources | undefined;

	onMount(async () => {
		resources = await getResources();
	});

	$: if (error) {
		toastStore.trigger({
			message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
			background: 'variant-filled-error',
			classes: 'pl-8'
		});
	}

	// Pagination

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
	<title>Search - The Redstone Index</title>
	<meta
		name="description"
		content="Search for Minecraft redstone creations on The Redstone Index."
	/>
</svelte:head>

<div class="min-h-[calc(100vh-12rem)] p-4 mb-5 flex flex-col gap-5 mt-10">
	<!-- Headline -->
	<div class="h-6 mx-auto truncate">
		{count} result{#if count > 1}s{/if}
		{#if $page.url.searchParams.get('query')}
			for
			<span class="font-semibold">"{$page.url.searchParams.get('query')}"</span>
		{/if}
	</div>

	<!-- Settings -->
	<SearchFilterPanel {...filters} />

	<!-- List of builds -->
	{#if builds}
		{#if !resources}
			<div class="h-96">
				<LoadingSpinnerArea />
			</div>
		{:else if builds.length === 0}
			<div class="grid place-items-center h-96 opacity-50">No builds found!</div>
		{:else}
			<div class="flex gap-5 flex-wrap justify-center">
				{#each builds as build}
					<BuildCard {supabase} {resources} {build} to={`/builds/${build.id}`} />
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
	<div class="container mx-auto">
		<Paginator
			settings={{ amounts: [25, 50, 100], page: Math.floor(offset / limit), limit, size: count }}
			on:page={onPageChange}
			on:amount={onAmountChange}
		/>
	</div>
</div>
