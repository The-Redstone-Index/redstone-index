<script lang="ts">
	import BuildViewer from '$lib/build-viewer/BuildViewer.svelte';
	import LoadingSpinnerArea from '$lib/build-viewer/LoadingSpinnerArea.svelte';
	import { getResources } from '$lib/build-viewer/helpers';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	let resources: Resources;
	let schemaData: ArrayBuffer;
	onMount(async () => {
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
		resources = await getResources();
	});
</script>

<div class="p-5 h-full w-full">
	{#if schemaData && resources}
		<BuildViewer {schemaData} {resources} doBlockList doElevationSlider doInputControls />
	{:else}
		<LoadingSpinnerArea />
	{/if}
</div>
