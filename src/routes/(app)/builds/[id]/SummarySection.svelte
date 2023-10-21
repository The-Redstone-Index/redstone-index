<script lang="ts">
	import { enhanceTextView, versionIntToString } from '$lib/utils';

	export let description: string;
	export let workingVersion: number | null;
	export let breakingVersion: number | null;
	export let tags: Array<string>;
</script>

<!-- Description -->
<section class="card p-5">
	<h2 class="mb-5 h3">Description</h2>
	<div class="whitespace-pre-wrap" use:enhanceTextView>{description}</div>
</section>

<!-- Minecraft Versions -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5 h3">Minecraft Version Compatability</h2>
	<div class="flex gap-4 mb-4">
		<div>Works in:</div>
		{#if workingVersion}
			<div class="chip variant-filled-success">
				{versionIntToString(workingVersion)} +
			</div>
		{:else}
			<div class="opacity-50">Not specified</div>
		{/if}
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
