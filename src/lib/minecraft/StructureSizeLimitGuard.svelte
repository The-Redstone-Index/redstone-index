<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { getStructureBlockList } from './utils';

	export let blockCountLimit: number = 8000;
	export let showContinue: boolean = false;
	export let schemaData: ArrayBuffer;

	let tooManyBlocks = false;
	let blockCount = -1;

	onMount(() => {
		// Check block counts
		const blockList = getStructureBlockList(schemaData);
		blockCount = Object.values(blockList).reduce((acc, value) => acc + value, 0);
		if (blockCount > blockCountLimit) {
			tooManyBlocks = true;
		}
	});

	function onContinue() {
		tooManyBlocks = false;
	}
</script>

{#if tooManyBlocks}
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
	<slot />
{/if}
