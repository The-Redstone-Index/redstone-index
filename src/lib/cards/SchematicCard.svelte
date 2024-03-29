<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StructureSizeLimitGuard from '$lib/minecraft/StructureSizeLimitGuard.svelte';
	import { minecraftStore, supabaseStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import StaticStructurePreview from '../minecraft/StaticStructurePreview.svelte';
	import StructureViewer from '../minecraft/StructureViewer.svelte';

	export let schematic: Tables<'schematics'>;
	export let to: string | undefined = undefined;

	$: resources = $minecraftStore?.resources;
	const supabase: SupabaseClient = $supabaseStore;

	let hovering = false;
	let loaded = false;
	let failed = false;
	$: if (!hovering) loaded = false;
	let schemaData: ArrayBuffer | undefined;

	onMount(async () => {
		const { data, error } = await supabase.storage
			.from('schematics')
			.download(schematic.object_path);
		if (error) {
			console.warn('Error downloading schematic:' + error.message);
			failed = true;
		}
		if (data) {
			schemaData = await data.arrayBuffer();
		}
	});
</script>

<div
	role="article"
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
>
	<a
		href={to}
		target="_blank"
		class="relative block card card-hover overflow-clip !w-80 group h-fit origin-top-left"
		on:click
	>
		<!-- Preview -->
		<div class="w-full h-72 bg-surface-800 group-hover:bg-surface-700 relative overflow-hidden">
			{#if failed}
				<div class="grid place-items-center h-72 text-4xl text-gray-400">
					<i class="fa-solid fa-circle-exclamation animate-pulse" />
				</div>
			{:else if resources && browser && schemaData}
				<StructureSizeLimitGuard {schemaData} showContinue={hovering} let:limitExceeded>
					<div class="flex flex-col" class:flex-col-reverse={loaded && hovering}>
						<div class="w-80 h-72">
							<StaticStructurePreview {schemaData} {resources} />
						</div>
						<div class="w-80 h-72">
							{#if hovering && !limitExceeded}
								<StructureViewer {schemaData} {resources} doStaticRotation bind:loaded />
							{/if}
						</div>
					</div>
				</StructureSizeLimitGuard>
			{:else}
				<div class="h-72">
					<LoadingSpinnerArea />
				</div>
			{/if}
		</div>

		<!-- Slot for overlay elements -->
		<div class="absolute top-0 left-0 w-full h-72">
			<slot />
		</div>

		<!-- Info + Date -->
		<footer class="p-1 flex justify-start items-center space-x-4">
			<div class="flex justify-between items-center opacity-70 grow px-3">
				<small>#{schematic.id}</small>
				<small class="whitespace-nowrap flex-shrink-0">
					On {new Date(schematic.created_at).toLocaleString()}
				</small>
			</div>
		</footer>
	</a>
</div>
