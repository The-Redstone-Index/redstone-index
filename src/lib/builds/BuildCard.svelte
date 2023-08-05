<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import StaticStructurePreview from '$lib/minecraft-rendering/StaticStructurePreview.svelte';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let resources: Resources;

	let title = [
		'Compact Instant 0-Tick 2 Wide Tileable Binary Adder Awesome Build Super cool mega project',
		'Tiny 2x2 Hidden Piston Door [Flush & Seamless]',
		'4-bit 1Hz Redstone Computer',
		'Super Random Build'
	][Math.floor(Math.random() * 4)];
	let author = 'plasmatech8';
	let h = 0;
	let hovering = false;
	let visible = false;
	let root: Element;
	let url = Math.random() < 0.5 ? '/piston_trapdoor.nbt' : '/example_stuff.nbt';
	let loaded = false;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (!visible) console.log(title);
					visible = true;
					observer.disconnect();
				}
			});
		});
		observer.observe(root);
		return () => observer.disconnect();
	});
</script>

<div
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
	bind:this={root}
>
	<a href="/builds/0" class="relative block card card-hover overflow-clip !w-80 group h-fit">
		<!-- Preview -->
		<div class="w-80 h-64 bg-surface-800 overflow-hidden">
			<!-- if want to use an image file instead: style="background-image: url({imgSrc});" -->
			{#if resources && browser && visible}
				{#await fetch(url).then((r) => r.arrayBuffer())}
					<div class="p-10">
						<LoadingSpinnerArea />
					</div>
				{:then schemaData}
					<div class="flex flex-col" class:flex-col-reverse={loaded && hovering}>
						<div class="w-80 h-64">
							<StaticStructurePreview {schemaData} {resources} />
						</div>
						<div class="w-80 h-64">
							{#if hovering}
								<StructureViewer {schemaData} {resources} doStaticRotation bind:loaded />
							{/if}
						</div>
					</div>
				{/await}
			{/if}
		</div>

		<!-- Title -->
		<header class="w-80 overflow-clip transition-height" style="height: {h}px">
			<div
				bind:clientHeight={h}
				class="truncate transition-color duration-500 group-hover:whitespace-normal group-hover:text-primary-600 dark:group-hover:text-primary-500 font-bold tracking-tight py-1 p-2 !text-base"
			>
				{title}
			</div>
		</header>
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
