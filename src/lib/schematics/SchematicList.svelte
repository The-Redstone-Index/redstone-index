<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import LoadingSpinnerArea from '../LoadingSpinnerArea.svelte';
	import { getResources } from '../minecraft-rendering/helpers';
	import SchematicCard from './SchematicCard.svelte';

	export let items = Array.from({ length: 30 }, () => ({
		published: Math.random() < 0.5,
		schemaData: null
	}));

	let resources: Resources;
	let schemaData: ArrayBuffer;

	onMount(async () => {
		resources = await getResources();
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap justify-center">
	{#if resources && schemaData && browser}
		{#each items as item}
			<SchematicCard {resources}>
				<div class="flex justify-end w-full p-3">
					{#if item.published}
						<a
							href="/builds/0"
							class="btn btn-sm variant-filled-secondary opacity-70 hover:opacity-100"
						>
							Already Published
						</a>
					{:else}
						<a
							href="/builds/0"
							class="btn btn-sm variant-filled-primary opacity-70 hover:opacity-100"
						>
							Publish
						</a>
					{/if}
				</div>
			</SchematicCard>
		{/each}
	{:else}
		<LoadingSpinnerArea />
	{/if}
</div>
