<script lang="ts">
	export let tag: Omit<TagDetails, 'author'>;
</script>

<a
	href="/tags/{tag.id}"
	class="!card card-hover p-5 w-72 flex flex-col gap-3 overflow-hidden relative"
>
	<div class="text-xl truncate">
		<i class="fas fa-tag mr-2 opacity-60" />
		{tag.name}
	</div>
	<div>
		{#if tag.description}
			{tag.description}
		{:else}
			<span class="opacity-40">No description provided</span>
		{/if}
	</div>
	<div class="flex-1" />
	<div class="flex justify-between">
		<div class="truncate">
			{#if tag.parent}
				Parent: <a href="/tags/{tag.parent.id}" class="anchor">{tag.parent.name}</a>
			{/if}
		</div>
		<span class="opacity-60 ml-1">({tag.usage_count})</span>
	</div>
</a>
