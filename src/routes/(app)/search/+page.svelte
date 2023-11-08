<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { getSearchedBuilds } from '$lib/api.js';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import BuildCard from '$lib/display/BuildCard.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
	import { Paginator, getToastStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let data;
	let { builds, count, supabase } = data;
	$: ({ builds, count, supabase } = data);

	const toastStore = getToastStore();

	let offset = 0;
	let limit = 50;

	let resources: Resources;

	onMount(async () => {
		resources = await getResources();
	});

	async function handleSearch() {
		const [newBuilds, error, newCount] = await getSearchedBuilds(
			supabase,
			$page.url.searchParams.get('query'),
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
		builds = newBuilds;
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
	<title>Search - The Redstone Index</title>
	<meta
		name="description"
		content="Search for Minecraft redstone creations on The Redstone Index."
	/>
</svelte:head>

<div class="container min-h-[calc(100vh-12rem)] mx-auto p-4 mb-5 flex flex-col gap-5 mt-10">
	<!-- Headline -->
	<div class="h-6 truncate">
		{count} result{#if count > 1}s{/if}
		{#if $page.url.searchParams.get('query')}
			for
			<span class="font-semibold">"{$page.url.searchParams.get('query')}"</span>
		{/if}
	</div>

	<!-- Settings -->
	<div class="flex justify-between items-center">
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				const searchParams = $page.url.searchParams;
				searchParams.set('query', 'epic');
				goto(`?${searchParams.toString()}`, { invalidateAll: true });
			}}
		>
			Tags
		</button>
		<button class="btn variant-filled-primary">Specifications</button>
		<button class="btn variant-filled-primary">Sort by (date/likes)</button>
		<button class="btn variant-filled-primary">Minecraft version</button>
		<button class="btn-icon variant-filled-primary" on:click={invalidateAll}>
			<i class="fa-solid fa-rotate-right" />
		</button>
	</div>

	<!-- List of tags -->
	<div class="flex gap-5 flex-wrap">
		{#if resources}
			{#each builds as build}
				<BuildCard {supabase} {resources} {build} to={`/builds/${build.id}`} />
			{/each}
		{:else}
			<LoadingSpinnerArea />
		{/if}
	</div>

	<!-- Pagination -->
	<div class="flex-1" />
	<Paginator
		settings={{ amounts: [25, 50, 100], page: 0, limit: 50, size: count }}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
