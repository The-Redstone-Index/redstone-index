<script lang="ts">
	export let description: string;
	export let versions: Array<string>;
	export let tags: Array<string>;
</script>

<!-- Description -->
<section class="card p-5">
	<h2 class="mb-5">Description</h2>
	<div>
		<p>{description}</p>
	</div>
</section>

<!-- TODO: make description, versions, and tags sections separate -->
<!-- TODO: create tags/versions selection (& creation) functionality -->

<!-- Minecraft Versions -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5">Minecraft Version Compatability</h2>
	<div class="flex gap-3">
		{#each versions as version}
			<div
				class="chip variant-soft-success"
				class:variant-soft-error={version.toLowerCase().includes('breaks')}
			>
				{version}
			</div>
		{:else}
			No Versions Specified
		{/each}
	</div>
</section>

<!-- Tags -->
<section class="flex-[50%] card p-5">
	<h2 class="mb-5">Tags</h2>
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
