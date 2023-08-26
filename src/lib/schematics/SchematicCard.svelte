<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import type { Resources } from 'deepslate';
	import StaticStructurePreview from '../minecraft-rendering/StaticStructurePreview.svelte';
	import StructureViewer from '../minecraft-rendering/StructureViewer.svelte';

	export let resources: Resources;
	export let to: string = '/schematics/0?blocklist&inputcontrols&elevationslider';
	let hovering = false;
	let loaded = false;
	$: if (!hovering) loaded = false;
	let url = Math.random() < 0.5 ? '/piston_trapdoor.nbt' : '/example_stuff.nbt';
</script>

<div
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
>
	<a
		href={to}
		target="_blank"
		class="relative block card card-hover overflow-clip !w-80 group h-fit"
	>
		<!-- Preview -->
		<div class="w-full h-72 bg-surface-800 group-hover:bg-surface-700 relative overflow-hidden">
			{#if resources && browser}
				{#await fetch(url).then((r) => r.arrayBuffer())}
					<div class="p-10">
						<LoadingSpinnerArea />
					</div>
				{:then schemaData}
					<div class="flex flex-col" class:flex-col-reverse={loaded && hovering}>
						<div class="w-80 h-72">
							<StaticStructurePreview {schemaData} {resources} />
						</div>
						<div class="w-80 h-72">
							{#if hovering}
								<StructureViewer {schemaData} {resources} doStaticRotation bind:loaded />
							{/if}
						</div>
					</div>
				{/await}
			{/if}
		</div>

		<!-- Slot for overlay elements -->
		<div class="absolute top-0 left-0 w-full">
			<slot />
		</div>

		<!-- Info + Date -->
		<footer class="p-1 flex justify-start items-center space-x-4">
			<div class="flex justify-between items-center opacity-70 grow px-3">
				<div>#123124</div>
				<small class="whitespace-nowrap flex-shrink-0">On 26/02/2023</small>
			</div>
		</footer>
	</a>
</div>
