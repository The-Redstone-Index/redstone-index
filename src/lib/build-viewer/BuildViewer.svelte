<script lang="ts">
	import { ProgressRadial, RangeSlider } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { getResources, getStructureSize, renderStructure } from './helpers';

	export let schemaData: ArrayBuffer;
	export let width = 800;
	export let height = 600;
	export let extraClass = '';

	let canvas: HTMLCanvasElement;
	let loading = true;
	let clipElevation = 3;
	let maxClipElevation = 99999;

	// TODO: render function needs to be able to have new values passed in for the elevation

	onMount(async () => {
		const resources = await getResources();
		// const size = getStructureSize(schemaData);
		// clipElevation = size.y;
		// maxClipElevation = size.y;
		renderStructure(canvas, schemaData, resources, clipElevation);
		loading = false;
	});
</script>

<div class="w-fit relative">
	<canvas bind:this={canvas} {width} {height} class="bg-surface-800 rounded-3xl {extraClass}" />
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
	<!-- Clip Elevation Slider -->
	<div class="absolute bottom-0 w-full flex justify-center">
		<!-- <input type="range" max="100" class="w-11/12" bind:value={clipElevation} /> -->
		<RangeSlider
			name="range-slider"
			bind:value={clipElevation}
			max={maxClipElevation}
			step={1}
			ticked
			class="w-11/12"
			accent="accent-primary-500 dark:accent-primary-500"
		/>
	</div>
</div>
