<script lang="ts">
	import { editionCompatibilities } from '$lib/config';
	import type { EditionCompatibilityOption } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let selected: number[] = [];

	const dispatch = createEventDispatcher();

	function handleSelect(editionCompatibility: EditionCompatibilityOption) {
		if (selected.includes(editionCompatibility.id)) {
			dispatch('update', { editionCompatibility, checked: false });
		} else {
			dispatch('update', { editionCompatibility, checked: true });
		}
	}
</script>

<div class="grid w-full gap-6 md:grid-cols-2">
	{#each editionCompatibilities as t}
		<div class="min-h-[9rem]">
			<input
				type="checkbox"
				id={'build-type-' + t.name}
				name="build-type"
				value={t.id}
				class="hidden peer"
				on:click={() => handleSelect(t)}
				bind:group={selected}
			/>
			<label
				for={'build-type-' + t.name}
				class="inline-flex h-full items-center justify-between w-full p-5 border border-surface-200 dark:border-surface-500 rounded-3xl cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 dark:peer-checked:border-primary-500 dark:peer-checked:text-primary-500 card card-hover"
			>
				<div class="block">
					<div class="w-full text-lg font-semibold">{t.name}</div>
					<div class="w-full">{t.desc}</div>
				</div>
			</label>
		</div>
	{/each}
</div>
