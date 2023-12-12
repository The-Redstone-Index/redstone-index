<script lang="ts">
	import BlockChip from '$lib/chips/BlockChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { getBlockList } from '$lib/minecraft-rendering/mcmetaAPI';
	import { matchSearchTerms } from '$lib/utils';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	const modalStore = getModalStore();

	let blocksIncluded = ($modalStore[0].meta.blocksIncluded as string[]) ?? [];
	let resources = $modalStore[0].meta.resources as Resources;

	let searchText = '';
	let allBlocksList: string[] = [];
	let searchBlockList: string[] = [];

	function onSubmit() {
		$modalStore[0].response?.(blocksIncluded);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function toggleSelectBlock(blockName: string) {
		if (blocksIncluded.includes(blockName)) {
			blocksIncluded = blocksIncluded.filter((b) => b !== blockName);
		} else {
			blocksIncluded = [...blocksIncluded, blockName];
		}
	}

	function handleSearch() {
		searchBlockList = allBlocksList.filter((b) => matchSearchTerms(b, searchText));
	}

	const debouncedSearch = debounce(handleSearch, 300);

	onMount(async () => {
		allBlocksList = await getBlockList();
		handleSearch();
	});
</script>

<div class="card px-10 py-6 w-modal-wide">
	<div class="flex flex-col gap-6">
		<header class="text-3xl">Select Blocks Required</header>

		<!-- Search -->
		<input
			type="text"
			class="input"
			placeholder="Search tags..."
			bind:value={searchText}
			on:input={debouncedSearch}
		/>

		<!-- Block list -->
		<div class="max-h-96 flex flex-col gap-2">
			{#if !allBlocksList.length}
				<LoadingSpinnerArea />
			{:else}
				<div class="text-end">{searchBlockList.length} blocks</div>
				<div class="max-h-60 overflow-auto">
					<div class="flex flex-wrap gap-3 justify-center">
						{#each searchBlockList.slice(0, 16) as blockName (blockName)}
							{@const selected = blocksIncluded.includes(blockName)}
							<BlockChip
								{resources}
								{blockName}
								{selected}
								on:click={() => toggleSelectBlock(blockName)}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Selected -->
		<hr />
		<div class="overflow-y-auto">
			<div class="mb-1">Tags Required:</div>
			<div class="flex gap-2 w-full flex-wrap">
				{#each blocksIncluded as blockName (blockName)}
					<div animate:flip={{ duration: 400 }} out:fade={{ duration: 100 }}>
						<BlockChip
							{resources}
							{blockName}
							showDelete
							on:delete={() => toggleSelectBlock(blockName)}
						/>
					</div>
				{:else}
					<span class="opacity-50">None Selected</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if blocksIncluded.length}
				<button class="btn hover:variant-soft" on:click={() => (blocksIncluded = [])} type="button">
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSubmit} type="button">Confirm</button>
		</div>
	</div>
</div>
