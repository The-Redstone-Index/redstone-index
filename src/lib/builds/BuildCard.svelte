<script lang="ts">
	import { browser } from '$app/environment';
	import StaticStructurePreview from '$lib/minecraft-rendering/StaticStructurePreview.svelte';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';

	export let resources: Resources;

	let title =
		'Compact Instant 0-Tick 2 Wide Tileable Binary Adder Awesome Build Super cool mega project'.slice(
			0,
			Math.floor(Math.random() * 109)
		);
	let author = 'plasmatech8';
	let h = 0;
	let hovering = false;

	let url = Math.random() < 0.5 ? '/piston_trapdoor.nbt' : '/example_stuff.nbt';
</script>

<div
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
>
	<a href="/builds/0" class="relative block card card-hover overflow-clip !w-80 group h-fit">
		<!-- Preview -->
		<div class="w-full h-64 bg-surface-800 overflow-hidden relative">
			<!-- if want to use an image file instead: style="background-image: url({imgSrc});" -->
			{#if resources && browser}
				{#await fetch(url).then((r) => r.arrayBuffer()) then schemaData}
					<div class="absolute w-80 h-64">
						{#if hovering}
							<StructureViewer {schemaData} {resources} doStaticRotation />
						{:else}
							<StaticStructurePreview {schemaData} {resources} />
						{/if}
					</div>
				{/await}
			{/if}
		</div>

		<!-- Title -->
		<div class="w-80 overflow-clip transition-height" style="height: {h}px">
			<h5
				bind:clientHeight={h}
				class="truncate transition-color duration-500 group-hover:whitespace-normal group-hover:text-primary-600 dark:group-hover:text-primary-500 font-bold tracking-tight py-1 p-2 !text-base"
			>
				{title}
			</h5>
		</div>
		<!-- Author -->
		<footer class="p-1 flex justify-start items-center space-x-4">
			<Avatar initials="plasmatech8" width="w-9 flex-shrink-0" />
			<div class="flex justify-between items-center opacity-70 grow">
				<div class="max-w-[215px]">
					<small class="font-bold truncate">By {author}</small>
				</div>
				<small class="mr-3 whitespace-nowrap flex-shrink-0">On 26/02/2023</small>
			</div>
		</footer>
	</a>
</div>
