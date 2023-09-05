<script lang="ts">
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	let resources: Resources;
	let schemaData: ArrayBuffer;
	let viewerClientWidth: number;
	let viewerClientHeight: number;
	onMount(async () => {
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
		resources = await getResources();
	});
</script>

<div class="p-5 h-[85vh] w-full">
	<div
		class="bg-surface-800 rounded-xl h-full w-full"
		bind:clientWidth={viewerClientWidth}
		bind:clientHeight={viewerClientHeight}
	>
		{#if schemaData && resources}
			{#key viewerClientWidth + viewerClientHeight}
				<StructureViewer {schemaData} {resources} doBlockList doElevationSlider doInputControls />
			{/key}
		{:else}
			<LoadingSpinnerArea />
		{/if}
	</div>
</div>
