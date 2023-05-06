<script lang="ts">
	import { ProgressRadial, RangeSlider } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import ItemViewer from './ItemViewer.svelte';
	import {
		createStructureViewer,
		getResources,
		getStructureBlockList,
		getStructureSize
	} from './helpers';

	export let schemaData: ArrayBuffer;

	let canvas: HTMLCanvasElement;
	let loading = true;
	let resources: Resources;
	let maxClipElevation = 10;
	let controller: ReturnType<typeof createStructureViewer>;
	let blockList: [string, number][] = [];
	$: clipElevationStore = controller && controller.clipElevation;
	let height = 0;
	let width = 0;

	onMount(async () => {
		resources = await getResources();
		// Render structure
		const size = getStructureSize(schemaData);
		const defaultXRot = 0.7;
		const defaultYRot = 2.1;
		const defaultViewDistance =
			Math.sqrt(Object.values(size).reduce((agg, next) => agg + Math.pow(next, 2), 0)) * 0.8;
		maxClipElevation = size.y;
		controller = createStructureViewer(
			canvas,
			schemaData,
			resources,
			defaultXRot,
			defaultYRot,
			defaultViewDistance,
			Math.sqrt(size.x ** 2 + size.z ** 2),
			false,
			true
		);
		// Render item list
		blockList = Object.entries(getStructureBlockList(schemaData));
		loading = false;
	});
</script>

<div class="relative h-full w-full text-white" bind:clientHeight={height} bind:clientWidth={width}>
	<!-- Scheamtic Canvas -->
	<canvas bind:this={canvas} {width} {height} class="bg-surface-800 rounded-xl w-full h-full" />
	<!-- Clip Elevation Slider -->
	<div
		class="absolute top-0 left-0 h-full flex items-center p-5 pointer-events-none"
		style="direction: rtl; overflow-y: auto"
	>
		<div class="w-60 pointer-events-none h-full" style="direction: ltr">
			<ul class="pointer-events-auto w-16 mb-6">
				{#each blockList as [name, count]}
					<li class="flex gap-3 mb-3 items-center group overflow-x-visible">
						<ItemViewer {resources} blockId={name} />
						{count}
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
	<div class="absolute top-0 right-0 h-full w-14 flex items-center p-4">
		{#if clipElevationStore}
			<input
				type="range"
				class="accent-primary-500 dark:accent-primary-500 h-full"
				min={1}
				max={maxClipElevation}
				bind:value={$clipElevationStore}
				style="writing-mode: vertical-lr;"
			/>
		{/if}
	</div>
	<!-- Loading spinner -->
	<div class="absolute top-0 w-full h-full grid place-items-center pointer-events-none">
		{#if loading}
			<ProgressRadial
				stroke={180}
				class="absolute left-0 w-1/3 bottom-0"
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
			/>
		{/if}
	</div>
</div>
