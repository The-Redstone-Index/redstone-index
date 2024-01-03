<script lang="ts">
	import { browser } from '$app/environment';
	import { getImageUrl } from '$lib/api/storage';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StaticStructurePreview from '$lib/minecraft/StaticStructurePreview.svelte';
	import StructureViewer from '$lib/minecraft/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft/mcmetaAPI';
	import { minecraftStore } from '$lib/stores';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let supabase: SupabaseClient;
	export let schematicPath: string;
	export let extraSchematicPaths: string[] = [];
	export let extraImagePaths: string[] = [];

	const resources: Resources | undefined = $minecraftStore?.resources;

	$: assets = [schematicPath, ...extraSchematicPaths, ...extraImagePaths];

	let viewerClientWidth = 0; // For key block when window resized
	let viewerItem = 0;

	async function getSchematicData(objectPath: string) {
		const r = await supabase.storage.from('schematics').download(objectPath);
		return r.data ? r.data.arrayBuffer() : null;
	}
</script>

<section class="card sm:p-5">
	<div
		class="flex gap-2 flex-col md:flex-row justify-start flex-nowrap md:h-[600px]"
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
				src={getImageUrl(supabase, assets[viewerItem])}
				class="rounded-xl bg-surface-800 w-full aspect-square object-contain md:max-w-[calc(92vw-8rem)]"
				alt=""
			/>
		{/if}

		<!-- Image Selector -->
		<div
			class="flex flex-nowrap gap-2 overflow-y-auto p-1 pr-4 md:-order-1 md:flex-col items-center md:items-start md:min-w-[8rem]"
			style="scrollbar-gutter: stable;"
		>
			<!-- Schematics -->
			{#each assets as assetPath, i}
				{#if extraSchematicPaths.length && i === 1}
					<div class="font-semibold opacity-50 text-sm">
						<span class="hidden md:inline">Schematics</span>
						<span class="inline md:hidden text-4xl">·</span>
					</div>
				{/if}
				{#if extraImagePaths.length && i === extraSchematicPaths.length + 1}
					<div class="font-semibold opacity-50 text-sm">
						<span class="hidden md:inline">Images</span>
						<span class="inline md:hidden text-4xl">·</span>
					</div>
				{/if}

				<button type="button" on:click={() => (viewerItem = i)}>
					{#if assetPath.endsWith('.nbt')}
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-surface-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							{#if resources && browser}
								{#await getSchematicData(assetPath) then schemaData}
									{#if schemaData}
										{#key viewerClientWidth}
											{#if i === viewerItem}
												<StructureViewer {schemaData} {resources} doStaticRotation />
											{:else}
												<StaticStructurePreview {schemaData} {resources} />
											{/if}
										{/key}
									{:else}
										<div class="w-full h-full grid place-items-center text-surface-300">!</div>
									{/if}
								{/await}
							{/if}
						</div>
					{:else}
						<!-- Images -->
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-gray-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							<img
								src={getImageUrl(supabase, assetPath)}
								class="w-full h-full rounded-xl object-cover"
								alt=""
							/>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
