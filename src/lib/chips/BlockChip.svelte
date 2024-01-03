<script lang="ts">
	import StaticItemPreview from '$lib/minecraft/StaticItemPreview.svelte';
	import type { Resources } from 'deepslate';
	import { capitalize } from 'lodash';
	import { createEventDispatcher } from 'svelte';

	export let resources: Resources;
	export let blockName: string;
	export let showDelete: boolean = false;
	export let selected: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<!-- Inside key: selected block because Svelte does not remove the checkmark properly for some reason -->
{#key selected}
	<button
		class="chip variant-soft-surface flex items-center gap-2 p-2 justify-start"
		on:click
		type="button"
	>
		{#if selected}
			<i class="fas fa-check" />
		{/if}

		<StaticItemPreview {resources} blockId={blockName} />
		{capitalize(blockName.replaceAll('_', ' '))}

		{#if showDelete}
			<button type="button" on:click={() => dispatch('delete')}>
				<i class="fas fa-xmark" />
			</button>
		{/if}
	</button>
{/key}
