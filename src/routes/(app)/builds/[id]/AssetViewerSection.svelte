<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let supabase: SupabaseClient;
	export let assets: Array<string>;

	let viewerClientWidth = 0; // For key block when window resized
	let resources: Resources;
	let viewerItem = 0;

	onMount(async () => {
		resources = await getResources();
	});

	async function getSchematicData(objectPath: string) {
		const r = await supabase.storage.from('schematics').download(objectPath);
		return r.data ? r.data.arrayBuffer() : null;
	}
</script>

<section class="card p-5">
	<div
		class="flex gap-2 flex-col md:flex-row justify-center flex-nowrap md:h-[600px]"
		bind:clientWidth={viewerClientWidth}
	>
		<!-- Image -->
		{#if assets[viewerItem].endsWith('.nbt')}
			<div class="aspect-square md:aspect-auto h-full w-full bg-surface-800 rounded-xl">
				{#if resources && browser}
					{#await getSchematicData(assets[viewerItem])}
						<LoadingSpinnerArea />
					{:then schemaData}
						{#if schemaData}
							{#key viewerClientWidth}
								<StructureViewer
									{schemaData}
									{resources}
									doBlockList
									doElevationSlider
									doInputControls
								/>
							{/key}
						{:else}
							<div class="w-full h-full grid place-items-center text-surface-300">
								Sorry. There was an error downloading the file.
							</div>
						{/if}
					{/await}
				{:else}
					<LoadingSpinnerArea />
				{/if}
			</div>
		{:else}
			<img
				src={assets[viewerItem]}
				class="rounded-xl bg-surface-800 w-full h-full object-contain"
				alt=""
			/>
		{/if}

		<!-- Image Selector -->
		<div
			class="flex flex-nowrap gap-2 overflow-y-auto p-1 pr-4 md:-order-1 md:flex-col"
			style="scrollbar-gutter: stable;"
		>
			{#each assets as assetUrl, i}
				<button type="button" on:click={() => (viewerItem = i)}>
					{#if assetUrl.endsWith('.nbt')}
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-surface-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							{#if resources && browser}
								{#await getSchematicData(assetUrl) then schemaData}
									{#if schemaData}
										{#key viewerClientWidth}
											<StructureViewer {schemaData} {resources} doStaticRotation />
										{/key}
									{:else}
										<div class="w-full h-full grid place-items-center text-surface-300">!</div>
									{/if}
								{/await}
							{/if}
						</div>
					{:else}
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-gray-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							<img src={assetUrl} class="w-full h-full rounded-xl" alt="" />
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
