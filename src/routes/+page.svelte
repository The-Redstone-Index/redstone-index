<script lang="ts">
	import BuildCarousel from '$lib/builds/BuildCarousel.svelte';
</script>

<svelte:head>
	<title>The Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center items-center p-4 mb-10">
	<div class="grid place-items-center mt-5 relative">
		<div
			class="absolute mt-2 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 w-52 h-52 dark:w-28 dark:h-28 animate-pulse blur-2xl rounded-full -z-10"
		/>
		<img src="/redstone_dust.webp" alt="Redstone Index Logo" />
	</div>

	<div class="space-y-10 text-center mt-8 mb-5">
		<h2 class="font-bold">
			Welcome to
			<span class="text-redstone">The Redstone Index</span>
		</h2>
		<p>The place where people put redstone things.</p>
	</div>

	<section class="py-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold">
			<i class="fa-solid fa-bell-concierge mx-5 text-primary-500" />
			Recent Builds
		</h3>
		<BuildCarousel />
	</section>

	<section class="py-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold">
			<i class="fa-solid fa-fire mx-5 text-primary-500" />
			Popular Builds
		</h3>
		<BuildCarousel />
	</section>
</div>
