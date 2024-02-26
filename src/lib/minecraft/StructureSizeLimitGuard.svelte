<script lang="ts">
	import { structureSizeGuard } from '$lib/config';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { getStructureBlockList } from './utils';

	export let blockCountLimit = structureSizeGuard;
	export let showContinue: boolean = false;
	export let schemaData: ArrayBuffer;

	let guardActivated = false;
	let limitExceeded = false;
	let blockCount = -1;

	onMount(() => {
		// Check block counts
		const blockList = getStructureBlockList(schemaData);
		blockCount = Object.values(blockList).reduce((acc, value) => acc + value, 0);
		if (blockCount > blockCountLimit) {
			guardActivated = true;
			limitExceeded = true;
		}
	});

	function onContinue() {
		guardActivated = false;
	}
</script>

{#if guardActivated}
	<div class="w-full h-full relative flex flex-col justify-center items-center gap-1">
		<div class="text-sm text-white opacity-70">{blockCount.toLocaleString()} blocks!</div>
		{#if showContinue}
			<button
				class="btn btn-sm variant-soft-surface z-40"
				type="button"
				on:click|stopPropagation|preventDefault={onContinue}
				transition:slide={{ duration: 100 }}
			>
				<div class="text-white opacity-70">Render anyway?</div>
			</button>
		{/if}
	</div>
{:else}
	<slot {guardActivated} {limitExceeded} />
{/if}
