<script lang="ts">
	import BuildCarousel from '$lib/BuildCarousel.svelte';
</script>

<div class="container h-full mx-auto justify-center items-center p-4">
	<div class="space-y-10 text-center my-16">
		<h2 class="font-bold">
			Welcome to
			<span class="text-redstone">The Redstone Index </span>
		</h2>
	</div>

	<div class="w-full bg-red-800" />

	<section class="mb-8">
		<h3 class="mb-5 font-semibold">Recent Builds</h3>
		<BuildCarousel />
	</section>
	<section class="mb-8">
		<h3 class="mb-5 font-semibold">Popular Builds</h3>
		<BuildCarousel />
	</section>
</div>

<style lang="postcss">
</style>
