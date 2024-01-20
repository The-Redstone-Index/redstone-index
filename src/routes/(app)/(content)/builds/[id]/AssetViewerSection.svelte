<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StaticStructurePreview from '$lib/minecraft/StaticStructurePreview.svelte';
	import StructureSizeLimitGuard from '$lib/minecraft/StructureSizeLimitGuard.svelte';
	import StructureViewer from '$lib/minecraft/StructureViewer.svelte';
	import { minecraftStore } from '$lib/stores';
	import { getImageUrl } from '$lib/supabase-api/storage';
	import { debounce } from 'lodash';

	export let supabase: SupabaseClient;
	export let schematic: Tables<'schematics'>;
	export let extraSchematics: Tables<'schematics'>[] = [];
	export let extraImagePaths: string[] = [];

	$: resources = $minecraftStore?.resources;

	$: assets = [schematic, ...extraSchematics, ...extraImagePaths];
	$: selectedAsset = assets[viewerItem];

	let viewerItem = 0;

	// For key block when window resized
	let viewerClientWidth = 0;
	let debouncedClientWidth = 0;
	const updateDebouncedViewerClientWidth = debounce(
		() => (debouncedClientWidth = viewerClientWidth),
		500
	);
	$: if (viewerClientWidth) updateDebouncedViewerClientWidth();

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
		{#if typeof selectedAsset === 'string'}
			<!-- Image Preview -->
			<img
				src={getImageUrl(supabase, selectedAsset)}
				class="rounded-xl bg-surface-800 w-full aspect-square object-contain md:max-w-[calc(92vw-8rem)]"
				alt=""
			/>
		{:else}
			<!-- Schematic Preview -->
			<div class="aspect-square md:aspect-auto h-full w-full bg-surface-800 rounded-xl">
				{#if resources && browser}
					{#await getSchematicData(selectedAsset.object_path)}
						<LoadingSpinnerArea />
					{:then schemaData}
						{#if schemaData}
							<StructureSizeLimitGuard {schemaData} showContinue>
								{#key debouncedClientWidth}
									<StructureViewer
										{schemaData}
										{resources}
										doBlockList
										doElevationSlider
										doInputControls
									>
										<div class="opacity-30 hover:opacity-60 mb-2 hover:underline text-sm">
											<a
												href={`/schematics/${selectedAsset.id}?blocklist&elevationslider&inputcontrols`}
												target="_blank"
											>
												Schematic #{selectedAsset.id}
											</a>
										</div>
									</StructureViewer>
								{/key}
							</StructureSizeLimitGuard>
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
		{/if}

		<!-- Image Selector -->
		<div
			class="flex flex-nowrap gap-2 overflow-y-auto p-1 pr-4 md:-order-1 md:flex-col items-center md:items-start md:min-w-[8rem] overflow-x-auto md:overflow-x-hidden"
			style="scrollbar-gutter: stable;"
		>
			<!-- Schematics -->
			{#each assets as asset, i}
				{#if extraSchematics.length && i === 1}
					<div class="font-semibold opacity-50 text-sm">
						<span class="hidden md:inline">Schematics</span>
						<span class="inline md:hidden text-4xl">·</span>
					</div>
				{/if}
				{#if extraImagePaths.length && i === extraSchematics.length + 1}
					<div class="font-semibold opacity-50 text-sm">
						<span class="hidden md:inline">Images</span>
						<span class="inline md:hidden text-4xl">·</span>
					</div>
				{/if}
				<!-- Image Thumbnail -->

				<button type="button" on:click={() => (viewerItem = i)}>
					{#if typeof asset === 'string'}
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-gray-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							<img
								src={getImageUrl(supabase, asset)}
								class="w-full h-full rounded-xl object-cover"
								alt=""
							/>
						</div>
					{:else}
						<!-- Schematic Thumbnail -->
						<div
							class="aspect-video md:w-24 w-20 cursor-pointer select-none rounded-xl bg-surface-800 outline-primary-600 outline-2"
							class:outline={i === viewerItem}
						>
							{#if resources && browser}
								{#await getSchematicData(asset.object_path) then schemaData}
									{#if schemaData}
										{#key viewerClientWidth}
											<StructureSizeLimitGuard {schemaData}>
												{#if i === viewerItem}
													<StructureViewer {schemaData} {resources} doStaticRotation />
												{:else}
													<StaticStructurePreview {schemaData} {resources} />
												{/if}
											</StructureSizeLimitGuard>
										{/key}
									{:else}
										<div class="w-full h-full grid place-items-center text-surface-300">!</div>
									{/if}
								{/await}
							{/if}
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
