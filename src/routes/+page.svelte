<script lang="ts">
	import BuildCarousel from '$lib/BuildCarousel.svelte';
</script>

<svelte:head>
	<title>The Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center items-center p-4">
	<div class="space-y-10 text-center my-16">
		<h2 class="font-bold">
			Welcome to
			<span class="text-redstone">The Redstone Index </span>
		</h2>
	</div>

	<section class="mb-10 card variant-glass-primary py-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold">Recent Builds</h3>
		<BuildCarousel />
	</section>

	<section class="mb-10 card variant-glass-secondary py-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold">Popular Builds</h3>
		<BuildCarousel />
	</section>
</div>

<style lang="postcss">
</style>
