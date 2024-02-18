<script lang="ts">
	export let spec: Tables<'specifications'>;
</script>

<a
	href="/specifications/{spec.id}"
	class="!card card-hover p-5 w-72 flex flex-col gap-3 overflow-hidden relative"
	on:click
>
	<div class="text-xl truncate">
		<div class="relative inline-block">
			<i class="fas fa-sliders mr-2 opacity-60" />
			{#if spec.recommended}
				<i class="fas fa-star absolute text-xs top-0 right-0 text-yellow-500" />
			{/if}
		</div>
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
