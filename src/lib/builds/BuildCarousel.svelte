<script lang="ts">
	import type { Resources } from 'deepslate';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';
	import { getResources } from '../minecraft-rendering/mcmetaAPI';
	import BuildCard from './BuildCard.svelte';

	export let items = [...Array(20).keys()];

	let scrollContainer: Element;
	let scrollIndex = 0;
	let resources: Resources;
	let clientWidth: number;
	let firstClientWidth = false;

	const debouncedScrollToIndex = debounce(() => move(0), 100);
	$: isAtStart = scrollIndex === 0;
	$: isAtEnd = scrollIndex === items.length - 1;
	$: if (clientWidth) firstClientWidth && debouncedScrollToIndex(), (firstClientWidth = true);

	const move = (direction: number) => {
		const isWide = scrollContainer.clientWidth >= 1232;
		const amount = isWide ? 2 + Number(isAtStart) + Number(isAtEnd) : 1;
		scrollIndex += amount * direction;
		scrollIndex = Math.min(items.length - 1, Math.max(scrollIndex, 0));
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
			bind:clientWidth
		>
			{#each items as item, i}
				<div class="snap-center">
					<BuildCard {resources} />
				</div>
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
