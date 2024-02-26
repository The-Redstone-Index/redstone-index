<script lang="ts">
	import { structureSizeGuard } from '$lib/config';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import StaticItemViewer from './StaticItemPreview.svelte';
	import { createStructureViewer } from './rendering';
	import { getStructureBlockList, getStructureSize } from './utils';

	export let schemaData: ArrayBuffer;
	export let resources: Resources;
	export let doInputControls: boolean = false;
	export let doStaticRotation: boolean = false;
	export let doElevationSlider: boolean = false;
	export let doBlockList: boolean = false;
	export let loaded: boolean = false;

	// Canvas rendering
	let canvas: HTMLCanvasElement;
	let controller: ReturnType<typeof createStructureViewer>;
	let height = 0;
	let width = 0;

	// Structure information
	let size = { x: 0, y: 0, z: 0 };
	let blockList: [string, number][] = [];
	$: blockCount = blockList.reduce((agg, next) => agg + next[1], 0);
	const blockCountLimit = structureSizeGuard;

	// Clip elevation slider
	let maxClipElevation = 10;
	let elevationSliderValue = maxClipElevation;
	$: clipElevationStore = controller && controller.clipElevation;
	function onMoveSlider(e: Event) {
		if (blockCount > blockCountLimit) return;
		clipElevationStore.set(elevationSliderValue);
	}
	function onReleaseSlider(e: Event) {
		if (blockCount <= blockCountLimit) return;
		clipElevationStore.set(elevationSliderValue);
	}

	onMount(async () => {
		// Wait for 1 millisecond, because it fails to load on Firefox for some reason
		await new Promise((r) => setTimeout(r, 1));
		if (!canvas) return;
		// Viewer initial params
		size = getStructureSize(schemaData);
		const defaultViewDistance = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2) * 0.8;
		maxClipElevation = size.y;
		elevationSliderValue = size.y;

		// Render structure
		controller = createStructureViewer({
			canvas,
			schemaData,
			resources,
			defaultViewDistance,
			defaultElevation: maxClipElevation,
			doStaticRotation,
			doInputControls
		});
		// Render item list
		blockList = Object.entries(getStructureBlockList(schemaData)).toSorted((a, b) => b[1] - a[1]);
		loaded = true;
	});
</script>

<div
	class="relative h-full w-full text-white touch-none"
	bind:clientHeight={height}
	bind:clientWidth={width}
>
	<!-- Schematic Canvas -->
	<canvas bind:this={canvas} {width} {height} class="w-full h-full outline-none" tabindex="0" />
	<!-- Block List -->
	{#if doBlockList}
		<div
			class="absolute top-0 left-0 h-full flex items-center p-5 pointer-events-none hide-scrollbar"
			style="direction: rtl; overflow-y: auto"
		>
			<div class="w-60 pointer-events-none h-full" style="direction: ltr">
				<ul class="pointer-events-auto w-16 mb-6">
					{#each blockList as [name, count]}
						<li class="flex gap-3 mb-3 items-center group overflow-x-visible">
							<StaticItemViewer {resources} blockId={name} />
							<span class="opacity-70 group-hover:opacity-100">
								{count.toLocaleString()}
							</span>
							<span
								class="group-hover:opacity-80 opacity-0 transition-opacity pointer-events-none whitespace-nowrap"
							>
								{name.replace('_', ' ')}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
	<!-- Clip Elevation Slider -->
	{#if doElevationSlider && clipElevationStore}
		<div class="group">
			<div class="absolute top-0 right-0 pr-10 pt-3 opacity-70 group-hover:opacity-100">
				{elevationSliderValue} / {maxClipElevation}
			</div>
			<div class="absolute bottom-0 right-0 pr-10 pb-3 opacity-70 group-hover:opacity-100">
				<span class="text-red-500">{size.x}</span>
				×
				<span class="text-green-500">{size.y}</span>
				×
				<span class="text-blue-500">{size.z}</span>
			</div>
			<div
				class="absolute top-0 right-0 h-full w-14 flex items-end p-4 -rotate-90 pointer-events-none"
				style="width: {height}px"
			>
				<input
					type="range"
					class="accent-primary-500 dark:accent-primary-500 pointer-events-auto"
					min={1}
					max={maxClipElevation}
					bind:value={elevationSliderValue}
					on:change={onReleaseSlider}
					on:input={onMoveSlider}
				/>
			</div>
		</div>
	{/if}
	<!-- Bottom-middle notes or annotations -->
	<div class="absolute bottom-0 left-1/2 -translate-x-1/2">
		<slot />
	</div>
</div>
