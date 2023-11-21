<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { SpecRequirement } from '$lib/types';
	import { versionIntToString } from '$lib/utils';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { capitalize } from 'lodash';
	import FilterButton from './FilterButton.svelte';

	export let tagIds: number[] | null;
	export let specReqs: SpecRequirement[] | null;
	export let mcVersion: number | null;
	export let sortBy: string | null;
	export let blocksIncluded: string[] | null;
	export let sizeCategory: string | null;
	export let authorUsername: string | null;

	$: noFilters = [
		tagIds,
		specReqs,
		mcVersion,
		sortBy,
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
				if (r) {
					const searchParams = $page.url.searchParams;
					searchParams.set(searchParamName, Array.isArray(r) ? r.join(' ') : r);
					goto(`?${searchParams.toString()}`, { invalidateAll: true });
				}
			}
		});
	}

	function onTagsButtonClick() {
		_openSpecificModal('selectTagsModal', 'tags', { tagIds });
	}

	function onSpecsButtonClick() {
		_openSpecificModal('selectSpecReqsModal', 'specs', { specReqs });
	}

	function onSortByButtonClick() {
		_openSpecificModal('selectSortByModal', 'sort', { sortBy });
	}

	function onMcVersionButtonClick() {
		_openSpecificModal('selectMcVersionModal', 'mcversion', { mcVersion });
	}

	function onBlocksButtonClick() {
		_openSpecificModal('selectMcBlocksModal', 'blocks', { blocksIncluded });
	}

	function onSizeButtonClick() {
		_openSpecificModal('selectBuildSizeModal', 'size', { sizeCategory });
	}

	function onAuthorButtonClick() {
		_openSpecificModal('selectUserModal', 'author', { username: authorUsername });
	}

	// Clear Buttons

	function _clearSpecificFilter(name: string) {
		const searchParams = $page.url.searchParams;
		searchParams.delete(name);
		goto(`?${searchParams.toString()}`, { invalidateAll: true });
	}

	function clearTags() {
		_clearSpecificFilter('tags');
	}

	function clearSpecs() {
		_clearSpecificFilter('specs');
	}

	function clearSortBy() {
		_clearSpecificFilter('sort');
	}
	function clearMcVersion() {
		_clearSpecificFilter('mcversion');
	}
	function clearBlocks() {
		_clearSpecificFilter('blocks');
	}

	function clearSize() {
		_clearSpecificFilter('size');
	}

	function clearAuthor() {
		_clearSpecificFilter('author');
	}

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
	<FilterButton on:click={onSortByButtonClick} on:clear={clearSortBy} isSet={!!sortBy}>
		<svelte:fragment slot="button">
			<i class="fas fa-sort mr-2" />
			Sort By
		</svelte:fragment>
		<svelte:fragment slot="info">
			{sortBy}
		</svelte:fragment>
	</FilterButton>

	<!-- Version -->
	<FilterButton on:click={onMcVersionButtonClick} on:clear={clearMcVersion} isSet={!!mcVersion}>
		<svelte:fragment slot="button">
			<i class="fas fa-location-crosshairs mr-2" />
			Minecraft version
		</svelte:fragment>
		<svelte:fragment slot="info">
			{mcVersion && versionIntToString(mcVersion)}
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
