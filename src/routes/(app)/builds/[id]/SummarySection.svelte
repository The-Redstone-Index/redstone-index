<script lang="ts">
	import { versionIntToString } from '$lib/utils';

	export let description: string;
	export let workingVersion: number;
	export let breakingVersion: number | null;
	export let tags: Array<string>;
</script>

<!-- Description -->
<section class="card p-5">
	<h2 class="mb-5 h3">Description</h2>
	<div>
		<p>{description}</p>
	</div>
</section>

<!-- Minecraft Versions -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5 h3">Minecraft Version Compatability</h2>
	<div class="flex gap-4 mb-4">
		<div>Works in:</div>
		<div class="chip variant-filled-success">
			{versionIntToString(workingVersion)} +
		</div>
	</div>
	<div class="flex gap-4">
		<div>Breaks in:</div>
		{#if breakingVersion}
			<div class="chip variant-filled-error">
				{versionIntToString(breakingVersion)} +
			</div>
		{:else}
			<div class="opacity-50">Not specified</div>
		{/if}
	</div>
</section>

<!-- Tags -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5 h3">Tags</h2>
	<div class="flex gap-3">
		{#each tags as tag}
			<div class="chip variant-soft-primary">
				<i class="fa-solid fa-hashtag" />
				{tag}
			</div>
		{:else}
			No Tags
		{/each}
	</div>
</section>
