<script lang="ts">
	export let spec: Tables<'specifications'>;
</script>

<a
	href="/specifications/{spec.id}"
	class="!card card-hover p-5 w-72 flex flex-col gap-3 overflow-hidden relative"
>
	<div class="text-xl truncate">
		<i class="fas fa-sliders mr-2 opacity-60" />
		{spec.name}
	</div>
	<div class="truncate">
		{#if spec.description}
			{spec.description}
		{:else}
			<span class="opacity-40">No description provided</span>
		{/if}
	</div>
	<div class="flex-1" />
	<div class="opacity-60 flex justify-between">
		<span>{spec.unit ?? ''}</span>
		<span>({spec.usage_count})</span>
	</div>
</a>
