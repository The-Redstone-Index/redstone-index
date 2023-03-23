<script lang="ts">
	import BuildCard from '../routes/BuildCard.svelte';

	export let items = [...Array(20).keys()];

	let scrollContainer: Element;
	let scrollIndex = 0;

	$: atStart = scrollIndex === 0;
	$: atEnd = scrollIndex === items.length - 1;

	const move = (direction: number) => {
		scrollIndex += direction;
		scrollContainer.children[scrollIndex].scrollIntoView({ inline: 'start', block: 'nearest' });
	};
</script>

<div class="h-96">
	<div class="relative overflow-x-hidden overflow-y-visible">
		<div
			class="gap-4 px-5 pb-12 pt-2 no-scrollbar flex overflow-x-scroll scroll-smooth fade-x-overflow"
			bind:this={scrollContainer}
		>
			{#each items as item, i}
				<BuildCard />
			{/each}
		</div>
		<button
			class="btn-icon variant-filled-primary absolute left-3 top-48"
			disabled={atStart}
			on:click={() => move(-1)}><i class="fa-solid fa-caret-left" /></button
		>
		<button
			class="btn-icon variant-filled-primary absolute right-3 top-48"
			disabled={atEnd}
			on:click={() => move(1)}><i class="fa-solid fa-caret-right" /></button
		>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

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
