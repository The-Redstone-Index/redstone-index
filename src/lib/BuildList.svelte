<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import BuildCard from '../routes/BuildCard.svelte';
	import LoadingSpinnerArea from './LoadingSpinnerArea.svelte';
	import { getResources } from './minecraft-rendering/helpers';

	export let items = [...Array(30).keys()];

	let resources: Resources;
	let schemaData: ArrayBuffer;

	onMount(async () => {
		resources = await getResources();
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap justify-center">
	{#if resources && schemaData && browser}
		{#each items as item, i}
			<div class="h-[340px]" style="z-index: {items.length - i}">
				<BuildCard {resources} />
			</div>
		{/each}
	{:else}
		<LoadingSpinnerArea />
	{/if}
</div>
