<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte/internal';
	import { renderStaticStructure } from './helpers';

	export let resources: Resources;
	export let schemaData: ArrayBuffer;

	let canvas: HTMLCanvasElement;
	let height = 0;
	let width = 0;

	onMount(async () => {
		await new Promise((r) => setTimeout(r, 1));
		if (!canvas) return;
		renderStaticStructure(canvas, schemaData, resources);
	});
</script>

<div class="relative h-full w-full text-white" bind:clientHeight={height} bind:clientWidth={width}>
	<canvas bind:this={canvas} {width} {height} class="w-full h-full" />
</div>
