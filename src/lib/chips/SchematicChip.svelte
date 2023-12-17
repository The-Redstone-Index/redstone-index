<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let schematicId: number;
	export let showDelete: boolean = false;
	export let showLink: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<button class="chip variant-soft-surface flex items-center gap-2 p-2 justify-start w-fit" on:click>
	#{schematicId}

	{#if showLink}
		<a href={`/schematics/${schematicId}`} target="_blank" class="badge variant-filled h-4 !m-0">
			<i class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100" />
		</a>
	{/if}

	{#if showDelete}
		<button type="button" on:click={() => dispatch('delete')} class="!mx-0">
			<i class="fas fa-xmark" />
		</button>
	{/if}
</button>
