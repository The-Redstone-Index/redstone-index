<script lang="ts">
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';
	import { getResources } from '../minecraft-rendering/mcmetaAPI';
	import BuildCard from './BuildCard.svelte';

	export let builds: BuildDetails[];
	export let supabase: SupabaseClient;

	let scrollContainer: Element;
	let scrollIndex = 0;
	let resources: Resources;

	$: isAtStart = scrollIndex === 0;
	$: isAtEnd = scrollIndex === builds.length - 1;

	const move = (direction: number) => {
		const isWide = scrollContainer.clientWidth >= 1232;
		const amount = isWide ? 2 + Number(isAtStart) + Number(isAtEnd) : 1;
		scrollIndex += amount * direction;
		scrollIndex = Math.min(builds.length - 1, Math.max(scrollIndex, 0));
		scrollContainer.children[scrollIndex].scrollIntoView({ inline: 'center', block: 'nearest' });
	};

	onMount(async () => {
		resources = await getResources();
	});
</script>

<div class="h-96">
	<div class="relative overflow-x-hidden overflow-y-visible scroll-px-6">
		<div
			class="gap-4 px-10 pb-12 pt-2 hide-scrollbar flex overflow-x-scroll scroll-smooth fade-x-overflow snap-x snap-mandatory"
			bind:this={scrollContainer}
		>
			{#each builds as build}
				<div class="snap-center">
					<BuildCard {resources} {build} {supabase} to={`/builds/${build.id}`} />
				</div>
			{:else}
				<div class="w-full h-96 grid place-items-center font-semibold opacity-50">No Builds</div>
			{/each}
		</div>
		<button
			class="btn-icon variant-filled-primary absolute left-3 top-48 opacity-80"
			disabled={isAtStart}
			on:click={() => move(-1)}
			aria-label="Left"
		>
			<i class="fa-solid fa-caret-left" />
		</button>
		<button
			class="btn-icon variant-filled-primary absolute right-3 top-48 opacity-80"
			disabled={isAtEnd}
			on:click={() => move(1)}
			aria-label="Right"
		>
			<i class="fa-solid fa-caret-right" />
		</button>
	</div>
</div>

<style>
	.fade-x-overflow {
		--mask: linear-gradient(
			to right,
			rgba(0, 0, 0, 0) 0,
			rgba(0, 0, 0, 1) 0.5%,
			rgba(0, 0, 0, 1) 99.5%,
			rgba(0, 0, 0, 0) 100%
		);
		-webkit-mask: var(--mask);
		mask: var(--mask);
	}
</style>
