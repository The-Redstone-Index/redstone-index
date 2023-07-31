<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte/internal';
	import { getStructureSize, renderStaticStructure } from './helpers';

	export let resources: Resources;
	export let schemaData: ArrayBuffer;

	let canvas: HTMLCanvasElement;
	let height = 0;
	let width = 0;

	onMount(async () => {
		await new Promise((r) => setTimeout(r, 1));
		if (!canvas) return;
		const size = getStructureSize(schemaData);
		const defaultXRot = 0.7;
		const defaultYRot = 2.1;
		const defaultViewDistance = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2) * 0.8;
		renderStaticStructure(
			canvas,
			schemaData,
			resources,
			defaultXRot,
			defaultYRot,
			defaultViewDistance
		);
	});
</script>

<div class="relative h-full w-full text-white" bind:clientHeight={height} bind:clientWidth={width}>
	<canvas bind:this={canvas} {width} {height} class="w-full h-full" />
</div>
