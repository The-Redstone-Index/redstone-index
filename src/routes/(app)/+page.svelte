<script lang="ts">
	import GlowingRedstoneLogo from '$lib/common/GlowingRedstoneLogo.svelte';
	import BuildCarousel from '$lib/display/BuildCarousel.svelte';

	export let data;
	let { supabase, recentBuilds } = data;
	$: ({ supabase, recentBuilds } = data);
</script>

<svelte:head>
	<title>The Redstone Index</title>
	<meta
		name="description"
		content="Discover incredible Minecraft redstone contraptions crafted by the Redstone Community. Find innovative builds for your gaming adventures."
	/>
</svelte:head>

<div class="container h-full mx-auto justify-center items-center p-4 mb-10">
	<div class="mt-6 md:mt-12">
		<GlowingRedstoneLogo size="lg" pulse class="mx-auto hidden md:block" />
		<GlowingRedstoneLogo size="md" pulse class="mx-auto md:hidden" />
	</div>

	<div class="space-y-10 text-center mt-8 mb-10">
		<h2 class="font-bold h2">
			Welcome to
			<span class="text-redstone whitespace-nowrap">The Redstone Index</span>
		</h2>
		<p class="!mt-6 md:!mt-10">The place where people put redstone things.</p>
	</div>

	<section class="my-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold h3">
			<i class="fa-solid fa-bell-concierge mx-5 text-primary-500" />
			Recent Builds
		</h3>
		<BuildCarousel builds={recentBuilds} {supabase} />
	</section>

	<section class="my-4 px-2">
		<h3 class="mb-3 ml-4 font-semibold h3">
			<i class="fa-solid fa-fire mx-5 text-primary-500" />
			Popular Builds
		</h3>
		<BuildCarousel builds={[]} {supabase} />
	</section>
</div>
