<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: string[] = ['plasmatech8', '_blazar_'];

	const dispatch = createEventDispatcher();

	let selectedIndex = 0;

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			selectedIndex = (selectedIndex + items.length - 1) % items.length;
			return true;
		}
		if (event.key === 'ArrowDown') {
			selectedIndex = (selectedIndex + 1) % items.length;
			return true;
		}
		if (event.key === 'Enter') {
			selectItem(selectedIndex);
			return true;
		}
		return false;
	}

	function selectItem(index: number) {
		const item = items[index];
		if (item) dispatch('select', { id: item });
	}

	$: {
		selectedIndex = 0; // Reset selectedIndex when items change
	}
</script>

<div class="items w-64">
	{#if items.length > 0}
		{#each items as item, index}
			<!-- svelte-ignore a11y-autofocus -->
			<button
				class="item {index === selectedIndex ? 'is-selected' : ''}"
				on:click={() => selectItem(index)}
				on:keydown={onKeyDown}
				tabindex="0"
				aria-label={`Select ${item}`}
				autofocus={index === selectedIndex}
			>
				{item}
			</button>
		{/each}
	{:else}
		<div class="item">No result</div>
	{/if}
</div>

<style>
	.items {
		padding: 0.2rem;
		position: relative;
		border-radius: 0.5rem;
		background: #fff;
		color: rgba(0, 0, 0, 0.8);
		overflow: hidden;
		font-size: 0.9rem;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
	}

	.item {
		display: block;
		margin: 0;
		width: 100%;
		text-align: left;
		background: transparent;
		border-radius: 0.4rem;
		border: 1px solid transparent;
		padding: 0.2rem 0.4rem;
	}

	.is-selected {
		border-color: #000;
	}
</style>
