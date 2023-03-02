<script lang="ts">
	import BuildCard from './BuildCard.svelte';
</script>

<div class="container h-full mx-auto justify-center items-center">
	<div class="space-y-10 text-center my-16">
		<h2 class="font-bold">
			Welcome to
			<span class="text-redstone">The Redstone Index </span>
		</h2>
	</div>
	<div class="flex gap-5 justify-center flex-wrap">
		{#each [1, 2, 3, 4, 5] as _}
			<BuildCard />
		{/each}
	</div>
</div>

<style lang="postcss">
</style>
