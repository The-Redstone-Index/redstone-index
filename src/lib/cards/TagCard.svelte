<script lang="ts">
	export let tag: Omit<TagDetails, 'author'>;
</script>

<a
	href="/tags/{tag.id}"
	class="!card card-hover p-5 w-72 flex flex-col gap-3 overflow-hidden relative"
	on:click
>
	<div class="text-xl truncate">
		<div class="relative inline-block">
			<i class="fas fa-tag mr-2 opacity-60" />
			{#if tag.recommended}
				<i class="fas fa-star absolute text-xs top-0 right-0 text-yellow-500" />
			{/if}
		</div>
		{tag.name}
	</div>
	<div class="truncate">
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
