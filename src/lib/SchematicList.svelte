<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import LoadingSpinnerArea from './build-viewer/LoadingSpinnerArea.svelte';
	import StaticStructureViewer from './build-viewer/StaticStructureViewer.svelte';
	import { getResources } from './build-viewer/helpers';

	export let items = [...Array(1).keys()];

	let resources: Resources;

	onMount(async () => {
		resources = await getResources();
	});
</script>

<div
	class="gap-4 px-5 pb-12 pt-2 no-scrollbar flex overflow-x-scroll scroll-smooth fade-x-overflow"
>
	{#if resources && browser}
		{#each items as item, i}
			<div class="w-96 h-96">
				{#await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer())}
					<LoadingSpinnerArea />
				{:then schemaData}
					<StaticStructureViewer />
				{/await}
			</div>
		{/each}
	{:else}
		???
	{/if}
</div>
