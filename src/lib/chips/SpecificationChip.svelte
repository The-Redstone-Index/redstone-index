<script lang="ts">
	import { formatNumberCompact } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let spec: Tables<'specifications'>;
	export let showCount: boolean = false;
	export let showLink: boolean = false;
	export let showDelete: boolean = false;
	export let selected: boolean = false;
	export let soft: boolean = false;
	export let href: string | undefined = undefined;

	const dispatch = createEventDispatcher();
</script>

<!-- Inside key: selected block because Svelte does not remove the checkmark properly for some reason -->
{#key selected}
	<a {href} target="_blank">
		<button
			class="chip variant-filled-primary gap-1 px-1.5 py-1"
			on:click
			class:variant-filled-secondary={selected}
			type="button"
			class:variant-soft-primary={soft}
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
				<a
					href={`/specifications/${spec.id}`}
					target="_blank"
					class="badge variant-filled h-4 !m-0"
					class:variant-filled-primary={soft}
				>
					<i class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100" />
				</a>
			{/if}

			{#if showDelete}
				<button type="button" on:click|stopPropagation|preventDefault={() => dispatch('delete')}>
					<i class="fas fa-xmark" />
				</button>
			{/if}
		</button>
	</a>
{/key}
