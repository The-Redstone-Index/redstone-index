<script lang="ts">
	import BuildCard from './BuildCard.svelte';
</script>

<div class="container h-full mx-auto justify-center items-center p-4">
	<div class="space-y-10 text-center my-16">
		<h2 class="font-bold">
			Welcome to
			<span class="text-redstone">The Redstone Index </span>
		</h2>
	</div>
	<section class="mb-8">
		<h3 class="mb-5 font-semibold">Recent Builds</h3>
		<div class="flex gap-5">
			{#each [1, 2, 3, 4] as _}
				<BuildCard />
			{/each}
		</div>
	</section>
	<section class="mb-8">
		<h3 class="mb-5 font-semibold">Popular Builds</h3>
		<div class="flex gap-5">
			{#each [1, 2, 3, 4] as _}
				<BuildCard />
			{/each}
		</div>
	</section>
</div>

<style lang="postcss">
</style>
