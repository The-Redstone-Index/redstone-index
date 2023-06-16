<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import SchematicCard from './SchematicCard.svelte';
	import { getResources } from './build-viewer/helpers';

	export let items = [...Array(30).keys()];

	let resources: Resources;
	let schemaData: ArrayBuffer;

	onMount(async () => {
		resources = await getResources();
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap">
	{#if resources && schemaData && browser}
		{#each items as item, i}
			<SchematicCard {resources} />
		{/each}
	{:else}
		???
	{/if}
</div>
