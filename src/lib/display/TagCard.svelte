<script lang="ts">
	export let tag: TagDetails;
</script>

<a
	href="/tags/{tag.id}"
	class="!card card-hover p-5 w-72 flex flex-col gap-3 overflow-hidden relative"
>
	<div class="text-xl truncate">
		<i class="fas fa-tag mr-2 opacity-60" />
		{tag.name}
	</div>
	<div class="opacity-50 text-sm absolute top-5 right-5">
		({tag.usage_count})
	</div>
	<div>
		{#if tag.description}
			{tag.description}
		{:else}
			<span class="opacity-40">No description provided</span>
		{/if}
	</div>
	{#if tag.parent}
		<div>
			Parent: <a href="/tags/{tag.parent.id}" class="anchor">{tag.parent.name}</a>
		</div>
	{/if}
</a>
