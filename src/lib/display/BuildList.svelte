<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import BuildCard from '../cards/BuildCard.svelte';
	import LoadingSpinnerArea from '../common/LoadingSpinnerArea.svelte';
	import { getResources } from '../minecraft-rendering/mcmetaAPI';

	export let builds: BuildDetails[];
	export let supabase: SupabaseClient;

	let resources: Resources;
	let schemaData: ArrayBuffer;

	onMount(async () => {
		resources = await getResources();
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap justify-center">
	{#if resources && schemaData && browser}
		{#each builds as build, i}
			<div class="h-[340px]" style="z-index: {builds.length - i}">
				<BuildCard {resources} {build} {supabase} />
			</div>
		{/each}
	{:else}
		<LoadingSpinnerArea />
	{/if}
</div>
