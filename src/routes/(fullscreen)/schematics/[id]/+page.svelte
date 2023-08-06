<script lang="ts">
	import { page } from '$app/stores';
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft-rendering/helpers';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	let resources: Resources;
	let schemaData: ArrayBuffer;
	let viewerClientWidth: number;
	let viewerClientHeight: number;
	let url = '/piston_trapdoor.nbt';

	let doBlockList = false;
	let doElevationSlider = false;
	let doInputControls = false;
	let doStaticRotation = false;

	onMount(async () => {
		// Parameters
		doBlockList = $page.url.searchParams.get('blocklist') == '';
		doElevationSlider = $page.url.searchParams.get('elevationslider') == '';
		doInputControls = $page.url.searchParams.get('inputcontrols') == '';
		doStaticRotation = $page.url.searchParams.get('rotating') == '';
		// Rendering
		schemaData = await fetch(url).then((r) => r.arrayBuffer());
		resources = await getResources();
	});
</script>

<svelte:head>
	<title>Schematic - Redstone Index</title>
</svelte:head>

<div class="h-screen w-screen">
	<div
		class="bg-surface-800 h-full w-full"
		bind:clientWidth={viewerClientWidth}
		bind:clientHeight={viewerClientHeight}
	>
		{#if schemaData && resources}
			{#key viewerClientWidth + viewerClientHeight}
				<StructureViewer
					{schemaData}
					{resources}
					{doBlockList}
					{doElevationSlider}
					{doInputControls}
					{doStaticRotation}
				/>
			{/key}
		{:else}
			<LoadingSpinnerArea />
		{/if}
	</div>
</div>
