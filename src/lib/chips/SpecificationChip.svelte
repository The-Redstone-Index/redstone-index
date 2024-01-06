<script lang="ts">
	import { formatNumberCompact } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let spec: Tables<'specifications'>;
	export let showCount: boolean = false;
	export let showLink: boolean = false;
	export let showDelete: boolean = false;
	export let selected: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<!-- Inside key: selected block because Svelte does not remove the checkmark properly for some reason -->
{#key selected}
	<button
		class="chip variant-filled-primary gap-1 px-1.5 py-1"
		on:click
		class:variant-filled-secondary={selected}
		type="button"
	>
		{#if selected}
			<i class="fas fa-check" />
		{/if}
		<i class="fas fa-tag" />
		{spec.name}
		{#if showCount}
			({formatNumberCompact(spec.usage_count)})
		{/if}
		{#if showLink}
			<a href={`/specifications/${spec.id}`} target="_blank" class="badge variant-filled h-4 !m-0">
				<i class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100" />
			</a>
		{/if}

		{#if showDelete}
			<button type="button" on:click={() => dispatch('delete')}>
				<i class="fas fa-xmark" />
			</button>
		{/if}
	</button>
{/key}
