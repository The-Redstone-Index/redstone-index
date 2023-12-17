<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { buildSortOptions } from '$lib/config';
	import { minecraftStore, supabaseStore } from '$lib/stores';
	import type { SortConfig, SpecRequirement } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { capitalize } from 'lodash';
	import FilterButton from './FilterButton.svelte';

	export let tagIds: number[] | null;
	export let specReqs: SpecRequirement[] | null;
	export let mcVersion: number | null;
	export let sort: SortConfig | null;
	export let blocksIncluded: string[] | null;
	export let sizeCategory: string | null;
	export let authorUsername: string | null;

	const resources: Resources | undefined = $minecraftStore?.resources;
	const supabase: SupabaseClient = $supabaseStore;

	$: noFilters = [
		tagIds,
		specReqs,
		mcVersion,
		sort,
		blocksIncluded,
		sizeCategory,
		authorUsername
	].every((v) => !v);

	const modalStore = getModalStore();

	// Filter Buttons

	function _openSpecificModal(modalComponentName: string, searchParamName: string, data: Object) {
		modalStore.trigger({
			type: 'component',
			component: modalComponentName,
			meta: data,
			response: (r) => {
				if (r !== undefined) {
					const searchParams = $page.url.searchParams;
					if (r) searchParams.set(searchParamName, Array.isArray(r) ? r.join(' ') : r);
					else searchParams.delete(searchParamName);
					goto(`?${searchParams.toString()}`, { invalidateAll: true });
				}
			}
		});
	}

	const onTagsButtonClick = () =>
		_openSpecificModal('selectTagsModal', 'tags', { tagIds, supabase });
	const onSpecsButtonClick = () =>
		_openSpecificModal('selectSpecReqsModal', 'specs', { specReqs, supabase });
	const onSortByButtonClick = () =>
		_openSpecificModal('selectSortByModal', 'sort', { sort, supabase });
	const mcVersionNote =
		'Any build without a specified working version will be excluded from search results.';
	const onMcVersionButtonClick = () =>
		_openSpecificModal('selectMcVersionModal', 'mcversion', { mcVersion, note: mcVersionNote });
	const onBlocksButtonClick = () =>
		_openSpecificModal('selectMcBlocksModal', 'blocks', { blocksIncluded, resources });
	const onSizeButtonClick = () =>
		_openSpecificModal('selectBuildSizeModal', 'size', { sizeCategory });
	const onAuthorButtonClick = () =>
		_openSpecificModal('selectUserModal', 'author', { username: authorUsername });

	// Clear Buttons

	function _clearSpecificFilter(name: string) {
		const searchParams = $page.url.searchParams;
		searchParams.delete(name);
		goto(`?${searchParams.toString()}`, { invalidateAll: true });
	}

	const clearTags = () => _clearSpecificFilter('tags');
	const clearSpecs = () => _clearSpecificFilter('specs');
	const clearSortBy = () => _clearSpecificFilter('sort');
	const clearMcVersion = () => _clearSpecificFilter('mcversion');
	const clearBlocks = () => _clearSpecificFilter('blocks');
	const clearSize = () => _clearSpecificFilter('size');
	const clearAuthor = () => _clearSpecificFilter('author');

	function clearAll() {
		const query = $page.url.searchParams.get('query');
		goto(query ? `?query=${query}` : '?', { invalidateAll: true });
	}
</script>

<div
	class="flex justify-between items-start gap-2 max-w-7xl w-full mx-auto overflow-auto pb-4 whitespace-nowrap"
>
	<!-- Tags -->
	<FilterButton on:click={onTagsButtonClick} on:clear={clearTags} isSet={!!tagIds}>
		<svelte:fragment slot="button">
			<i class="fas fa-tag mr-2" />
			Tags
		</svelte:fragment>
		<svelte:fragment slot="info">
			{tagIds?.length} selected
		</svelte:fragment>
	</FilterButton>

	<!-- Specs -->
	<FilterButton on:click={onSpecsButtonClick} on:clear={clearSpecs} isSet={!!specReqs}>
		<svelte:fragment slot="button">
			<i class="fas fa-sliders mr-2" />
			Specifications
		</svelte:fragment>
		<svelte:fragment slot="info">
			{specReqs?.length} selected
		</svelte:fragment>
	</FilterButton>

	<!-- Sort -->
	{#key sort}
		<FilterButton on:click={onSortByButtonClick} on:clear={clearSortBy} isSet={!!sort}>
			<svelte:fragment slot="button">
				<i class="fas fa-sort mr-2" />
				Sort By
			</svelte:fragment>
			<svelte:fragment slot="info">
				{#if sort?.by}
					{#if sort?.ascending}
						{@html buildSortOptions[sort.by].ascendingLabel}
					{:else}
						{@html buildSortOptions[sort.by].descendingLabel}
					{/if}
				{/if}
			</svelte:fragment>
		</FilterButton>
	{/key}

	<!-- Version -->
	<FilterButton on:click={onMcVersionButtonClick} on:clear={clearMcVersion} isSet={!!mcVersion}>
		<svelte:fragment slot="button">
			<i class="fas fa-location-crosshairs mr-2" />
			Minecraft version
		</svelte:fragment>
		<svelte:fragment slot="info">
			{mcVersion && minecraftStore?.getVersionName(mcVersion)}
		</svelte:fragment>
	</FilterButton>

	<!-- Blocks -->
	<FilterButton on:click={onBlocksButtonClick} on:clear={clearBlocks} isSet={!!blocksIncluded}>
		<svelte:fragment slot="button">
			<i class="fas fa-cube mr-2" />
			Blocks
		</svelte:fragment>
		<svelte:fragment slot="info">
			{blocksIncluded?.length} selected
		</svelte:fragment>
	</FilterButton>

	<!-- Size -->
	<FilterButton on:click={onSizeButtonClick} on:clear={clearSize} isSet={!!sizeCategory}>
		<svelte:fragment slot="button">
			<i class="fas fa-ruler mr-2" />
			Size
		</svelte:fragment>
		<svelte:fragment slot="info">
			{sizeCategory && capitalize(sizeCategory)}
		</svelte:fragment>
	</FilterButton>

	<!-- Author -->
	<FilterButton on:click={onAuthorButtonClick} on:clear={clearAuthor} isSet={!!authorUsername}>
		<svelte:fragment slot="button">
			<i class="fas fa-user mr-2" />
			Author
		</svelte:fragment>
		<svelte:fragment slot="info">
			{authorUsername}
		</svelte:fragment>
	</FilterButton>

	<!-- Refresh/Clear -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn-icon variant-filled-primary" on:click={invalidateAll}>
			<i class="fa-solid fa-rotate-right" />
		</button>
		{#if !noFilters}
			<button class="btn btn-sm hover:variant-soft-error" on:click={clearAll}>Clear all</button>
		{/if}
	</div>
</div>
