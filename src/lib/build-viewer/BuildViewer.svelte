<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import ItemViewer from './ItemViewer.svelte';
	import { createStructureViewer, getStructureBlockList, getStructureSize } from './helpers';

	export let schemaData: ArrayBuffer;
	export let resources: Resources;
	export let doInputControls: boolean = false;
	export let doStaticRotation: boolean = false;
	export let doElevationSlider: boolean = false;
	export let doBlockList: boolean = false;

	let canvas: HTMLCanvasElement;
	let maxClipElevation = 10;
	let controller: ReturnType<typeof createStructureViewer>;
	let blockList: [string, number][] = [];
	$: clipElevationStore = controller && controller.clipElevation;
	let height = 0;
	let width = 0;

	onMount(async () => {
		// Wait for 1 millisecond, because it fails to load on Firefox for some reason
		await new Promise((r) => setTimeout(r, 1));
		// Viewer initial params
		const size = getStructureSize(schemaData);
		const defaultXRot = 0.7;
		const defaultYRot = 2.1;
		const defaultViewDistance = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2) * 0.8;

		maxClipElevation = size.y;
		// Render structure
		controller = createStructureViewer(
			canvas,
			schemaData,
			resources,
			defaultXRot,
			defaultYRot,
			defaultViewDistance,
			maxClipElevation,
			doStaticRotation,
			doInputControls
		);
		// Render item list
		blockList = Object.entries(getStructureBlockList(schemaData));
	});
</script>

<div class="relative h-full w-full text-white" bind:clientHeight={height} bind:clientWidth={width}>
	<!-- Scheamtic Canvas -->
	<canvas bind:this={canvas} {width} {height} class="w-full h-full outline-none" tabindex="0" />
	<!-- Block List -->
	{#if doBlockList}
		<div
			class="absolute top-0 left-0 h-full flex items-center p-5 pointer-events-none"
			style="direction: rtl; overflow-y: auto"
		>
			<div class="w-60 pointer-events-none h-full" style="direction: ltr">
				<ul class="pointer-events-auto w-16 mb-6">
					{#each blockList as [name, count]}
						<li class="flex gap-3 mb-3 items-center group overflow-x-visible">
							<ItemViewer {resources} blockId={name} />
							<span class="opacity-70 group-hover:opacity-100">
								{count}
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
				{$clipElevationStore} / {maxClipElevation}
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
					bind:value={$clipElevationStore}
				/>
			</div>
		</div>
	{/if}
</div>
