<script lang="ts">
	import { browser } from '$app/environment';
	import type { Resources } from 'deepslate';
	import { fade } from 'svelte/transition';
	import StaticStructureViewer from './minecraft-rendering/StaticStructurePreview.svelte';
	import StructureViewer from './minecraft-rendering/StructureViewer.svelte';

	export let resources: Resources;
	export let to: string = '/schematics/0';
	let hovering = false;
</script>

<div
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
>
	<a href={to} class="relative block card card-hover overflow-clip !w-80 group h-fit">
		<!-- Preview -->
		<div class="w-full h-72 bg-surface-800 relative">
			{#if resources && browser}
				{#await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer()) then schemaData}
					<div class="w-full h-72">
						<StaticStructureViewer {schemaData} {resources} />
					</div>
					{#if hovering}
						<div
							class="w-full h-72 absolute top-0 left-0 bg-surface-800"
							transition:fade={{ duration: 200 }}
						>
							<StructureViewer {schemaData} {resources} doStaticRotation />
						</div>
					{/if}
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
