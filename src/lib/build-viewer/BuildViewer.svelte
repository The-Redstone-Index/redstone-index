<script lang="ts">
	import { ProgressRadial, RangeSlider } from '@skeletonlabs/skeleton';
	import { Structure } from 'deepslate';
	import { onMount } from 'svelte';
	import { createStructureViewer, getResources, getStructureSize } from './helpers';

	export let schemaData: ArrayBuffer;
	export let width = 800;
	export let height = 600;
	export let extraClass = '';

	let canvas: HTMLCanvasElement;
	let loading = true;
	let maxClipElevation = 10;
	let controller: ReturnType<typeof createStructureViewer>;
	$: clipElevationStore = controller && controller.clipElevation;

	onMount(async () => {
		const resources = await getResources();
		const size = getStructureSize(schemaData);
		maxClipElevation = size.y;
		controller = createStructureViewer(
			canvas,
			schemaData,
			resources,
			0.8,
			0.5,
			5,
			Math.sqrt(size.x ** 2 + size.z ** 2),
			false,
			true
		);
		loading = false;
	});
</script>

<div class="w-fit relative">
	<!-- Scheamtic Canvas -->
	<canvas bind:this={canvas} {width} {height} class="bg-surface-800 rounded-3xl {extraClass}" />
	<!-- Clip Elevation Slider -->
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
