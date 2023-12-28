<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import { renderStaticItem } from './helpers';

	export let resources: Resources;
	export let blockId: string;

	let canvas: HTMLCanvasElement;
	let height = 0;
	let width = 0;

	onMount(async () => {
		await new Promise((r) => setTimeout(r, 1));
		if (!canvas) return;
		renderStaticItem({ canvas, resources, blockId });
	});
</script>

<div bind:clientHeight={height} bind:clientWidth={width} class="w-8 h-8">
	<canvas bind:this={canvas} {width} {height} class="w-8 h-8" />
</div>
