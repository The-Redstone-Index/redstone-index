<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte/internal';
	import { renderStaticItem } from './helpers';

	let canvas: HTMLCanvasElement;
	export let resources: Resources;
	export let blockId: string;

	onMount(() => {
		renderStaticItem(canvas, resources, blockId);
	});
</script>

<canvas bind:this={canvas} class="w-8 h-8" />
