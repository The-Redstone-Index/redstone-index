<script lang="ts">
	import VersionChip from '$lib/chips/VersionChip.svelte';
	import { minecraftStore } from '$lib/stores';
	import { enhanceTextView } from '$lib/utils';
	import type { Resources } from 'deepslate';

	export let description: string;
	export let testedVersion: number | null;
	export let workingVersion: number | null;
	export let breakingVersion: number | null;
	export let tags: Array<string>;
</script>

<!-- Description -->
<section class="card p-5">
	<h2 class="mb-5 h3">Description</h2>
	{#if description}
		<div class="whitespace-pre-wrap" use:enhanceTextView>{description}</div>
	{:else}
		<div class="opacity-50">No description provided</div>
	{/if}
</section>

<!-- Minecraft Versions -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5 h3">Minecraft Version Compatibility</h2>
	<div class="grid grid-cols-2 w-fit gap-4">
		<!-- Tested Version -->
		<div>Tested in:</div>
		{#if testedVersion}
			<VersionChip version={testedVersion} type="tested" />
		{:else}
			<div class="opacity-50">Not specified</div>
		{/if}
		<!-- Working Version -->
		<div>Starts working in:</div>
		{#if workingVersion}
			<VersionChip version={workingVersion} type="working" />
		{:else}
			<div class="opacity-50">Not specified</div>
		{/if}
		<!-- Breaking Version -->
		<div>Breaks in:</div>
		{#if breakingVersion}
			<VersionChip version={breakingVersion} type="breaking" />
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
