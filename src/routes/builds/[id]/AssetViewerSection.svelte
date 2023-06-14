<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/build-viewer/LoadingSpinnerArea.svelte';
	import StructureViewer from '$lib/build-viewer/StructureViewer.svelte';
	import { getResources } from '$lib/build-viewer/helpers';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let assets: Array<string>;

	let viewerClientWidth = 0; // For key block when window resized
	let resources: Resources;
	let viewerItem = 0;

	onMount(async () => {
		resources = await getResources();
	});
</script>

<section class="card p-5">
	<div
		class="flex gap-2 flex-col md:flex-row justify-center flex-nowrap md:h-[600px]"
		bind:clientWidth={viewerClientWidth}
	>
		<!-- Image -->
		{#if assets[viewerItem].endsWith('.nbt') && browser}
			<div class="aspect-square md:aspect-auto h-full w-full bg-surface-800 rounded-xl">
				{#if resources}
					{#await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer())}
						<LoadingSpinnerArea />
					{:then schemaData}
						{#key viewerClientWidth}
							<StructureViewer
								{schemaData}
								{resources}
								doBlockList
								doElevationSlider
								doInputControls
							/>
						{/key}
					{/await}
				{:else}
					<LoadingSpinnerArea />
				{/if}
			</div>
		{:else}
			<img
				src={assets[viewerItem]}
				class="rounded-xl bg-gray-500 w-full h-full object-cover"
				alt=""
			/>
		{/if}

		<!-- Image Selector -->
		<div class="flex flex-nowrap gap-2 overflow-auto p-1 md:-order-1 md:flex-col">
			{#each assets as assetUrl, i}
				<button on:click={() => (viewerItem = i)}>
					{#if assetUrl.endsWith('.nbt') && browser}
						<div
							class="aspect-video md:w-28 w-20 cursor-pointer select-none rounded-xl bg-surface-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							{#if resources}
								{#await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer()) then schemaData}
									{#key viewerClientWidth}
										<StructureViewer {schemaData} {resources} doStaticRotation />
									{/key}
								{/await}
							{/if}
						</div>
					{:else}
						<img
							src={assetUrl}
							class="aspect-video md:w-32 w-20 cursor-pointer select-none rounded-xl bg-gray-500 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
							alt=""
						/>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
