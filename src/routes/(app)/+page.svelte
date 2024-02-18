<script lang="ts">
	import Boop from '$lib/common/Boop.svelte';
	import GlowingRedstoneLogo from '$lib/common/GlowingRedstoneLogo.svelte';
	import BuildCarousel from '$lib/display/BuildCarousel.svelte';

	export let data;
	let { recentBuilds, trendingBuilds } = data;
	$: ({ recentBuilds, trendingBuilds } = data);
</script>

<svelte:head>
	<title>The Redstone Index</title>
	<meta
		name="description"
		content="Discover incredible Minecraft redstone contraptions crafted by the Redstone Community. Find innovative builds for your gaming adventures."
	/>
</svelte:head>

<div class="container h-full mx-auto justify-center items-center p-4 mb-10">
	<div class="mt-6 md:mt-12 flex justify-center">
		<Boop>
			<GlowingRedstoneLogo size="lg" pulse class="mx-auto hidden md:block" />
			<GlowingRedstoneLogo size="md" pulse class="mx-auto md:hidden" />
		</Boop>
	</div>

	<div class="space-y-10 text-center mt-8 mb-6">
		<h2 class="font-bold h2">
			Welcome to
			<span class="text-redstone whitespace-nowrap">The Redstone Index</span>
		</h2>
		<p class="!mt-6 md:!mt-10">The place to share and discover redstone things!</p>
	</div>

	<div class="flex justify-center mb-10">
		<a href="/about" class="btn variant-filled-primary">About this platform</a>
	</div>

	<section class="my-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold h3">
			<i class="fa-solid fa-bell-concierge mx-5 text-primary-500" />
			Recent Builds
		</h3>
		<BuildCarousel builds={recentBuilds} />
	</section>

	<section class="my-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold h3">
			<i class="fa-solid fa-fire mx-5 text-primary-500" />
			Trending Builds
		</h3>
		<BuildCarousel builds={trendingBuilds} />
	</section>
</div>
