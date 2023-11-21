<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { SpecRequirement } from '$lib/types';
	import { versionIntToString } from '$lib/utils';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { capitalize } from 'lodash';

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

<div class="flex justify-between items-start gap-4 container mx-auto mb-10">
	<!-- Tags -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onTagsButtonClick}>
			<i class="fas fa-tag mr-2" />
			Tags
		</button>
		{#if tagIds}
			<div class="flex items-center gap-1">
				{tagIds.length} selected
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearTags}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>
	<!-- Specs -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onSpecsButtonClick}>
			<i class="fas fa-sliders mr-2" />
			Specifications
		</button>
		{#if specReqs}
			<div class="flex items-center gap-1">
				{specReqs.length} selected
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearSpecs}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>
	<!-- Sort -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onSortByButtonClick}>
			<i class="fas fa-sort mr-2" />
			Sort By
		</button>

		{#if sortBy}
			<div class="flex items-center gap-1">
				{sortBy}
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearSortBy}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>
	<!-- Version -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onMcVersionButtonClick}>
			<i class="fas fa-location-crosshairs mr-2" />
			Minecraft version
		</button>
		{#if mcVersion}
			<div class="flex items-center gap-1">
				{versionIntToString(mcVersion)}
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearMcVersion}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>
	<!-- Blocks -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onBlocksButtonClick}>
			<i class="fas fa-cube mr-2" />
			Blocks
		</button>
		{#if blocksIncluded}
			<div class="flex items-center gap-1">
				{blocksIncluded.length} selected
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearBlocks}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>

	<!-- Size -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onSizeButtonClick}>
			<i class="fas fa-ruler mr-2" />
			Size
		</button>
		{#if sizeCategory}
			<div class="flex items-center gap-1">
				{capitalize(sizeCategory)}
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearSize}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>

	<!-- Author -->
	<div class="flex flex-col gap-3 items-center">
		<button class="btn variant-filled-primary" on:click={onAuthorButtonClick}>
			<i class="fas fa-user mr-2" />
			Author
		</button>
		{#if authorUsername}
			<div class="flex items-center gap-1">
				{authorUsername}
				<button class="btn-icon w-6 hover:variant-soft-error" on:click={clearAuthor}>
					<i class="fa-solid fa-xmark" />
				</button>
			</div>
		{/if}
	</div>

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
