<script lang="ts">
	import { page } from '$app/stores';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StructureViewer from '$lib/minecraft/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft/mcmetaAPI.js';
	import type { Resources } from 'deepslate';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';

	export let data;
	let { supabase, schematic } = data;
	$: ({ supabase, schematic } = data);

	let resources: Resources;
	let schemaData: ArrayBuffer;

	let viewerClientWidth: number;
	let debouncedClientWidth = 0;
	const updateDebouncedViewerClientWidth = debounce(
		() => (debouncedClientWidth = viewerClientWidth),
		500
	);
	$: if (viewerClientWidth) updateDebouncedViewerClientWidth();

	let viewerClientHeight: number;
	let debouncedViewerClientHeight = 0;
	const updateDebouncedClientHeight = debounce(
		() => (debouncedViewerClientHeight = viewerClientHeight),
		500
	);
	$: if (viewerClientHeight) updateDebouncedClientHeight();

	let failed = false;

	let doBlockList = false;
	let doElevationSlider = false;
	let doInputControls = false;
	let doStaticRotation = false;

	onMount(async () => {
		// Parameters
		// Use ?blocklist&elevationslider&inputcontrols&rotating for all features
		doBlockList = $page.url.searchParams.get('blocklist') == '';
		doElevationSlider = $page.url.searchParams.get('elevationslider') == '';
		doInputControls = $page.url.searchParams.get('inputcontrols') == '';
		doStaticRotation = $page.url.searchParams.get('rotating') == '';
		// Download
		const { data, error } = await supabase.storage
			.from('schematics')
			.download(schematic.object_path);
		if (error) {
			console.warn('Error downloading schematic:' + error.message);
			failed = true;
		}
		// Render
		if (data) {
			schemaData = await data.arrayBuffer();
			resources = await getResources();
		}
	});
</script>

<svelte:head>
	<title>Fullscreen Schematic View - The Redstone Index</title>
	<meta
		name="description"
		content="Inspect a Minecraft redstone schematic on The Redstone Index."
	/>
</svelte:head>

<div class="h-screen w-screen">
	<div
		class="bg-surface-800 h-full w-full"
		bind:clientWidth={viewerClientWidth}
		bind:clientHeight={viewerClientHeight}
	>
		{#if failed}
			<div class="grid place-items-center h-full">
				<div class=" animate-pulse text-4xl text-gray-400">
					<i class="fa-solid fa-circle-exclamation mr-3" />
					Error downloading schematic
				</div>
			</div>
		{:else if schemaData && resources}
			{#key debouncedClientWidth + debouncedViewerClientHeight}
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
