<script lang="ts">
	import { supabaseStore } from '$lib/stores';
	import type { SpecValues } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let specValues: { [id: number]: number };
	export let readonly = false;

	let specIds = Object.keys(specValues)
		.map((id) => +id)
		.sort();

	const supabase = $supabaseStore;

	const dispatch = createEventDispatcher();

	async function getSpec(specId: number) {
		const { data, error } = await supabase
			.from('specifications')
			.select('*')
			.eq('id', specId)
			.single();
		if (error) {
			console.error(error);
			throw error;
		}
		return data;
	}

	const modalStore = getModalStore();

	function openSpecPickerModal() {
		modalStore.trigger({
			type: 'component',
			component: 'selectSpecsModal',
			meta: { specIds },
			response: (r) => {
				if (r) {
					specIds = (r as number[]).sort();
					const newSpecValues: SpecValues = {};
					specIds.forEach((id) => (newSpecValues[id] = specValues[id]));
					specValues = newSpecValues;
				}
			}
		});
	}

	function handleReset() {
		dispatch('reset');
		setTimeout(() => {
			specIds = Object.keys(specValues)
				.map((id) => +id)
				.sort();
		}, 1);
	}
</script>

<table class="table table-compact !table-hover">
	<thead class="text-left">
		<th>Name</th>
		<th>
			<div class="flex justify-between">
				<div>Value</div>
				{#if !readonly}
					<button
						class="btn btn-sm hover:variant-soft-surface flex gap-2"
						type="button"
						on:click={handleReset}
					>
						Reset
						<i class="fa-solid fa-rotate-right" />
					</button>
				{/if}
			</div>
		</th>
		<th>
			{#if !readonly}
				<button
					class="btn btn-sm hover:variant-soft-surface flex gap-2"
					type="button"
					on:click={openSpecPickerModal}
				>
					Configure
					<i class="fa-solid fa-sliders" />
				</button>
			{/if}
		</th>
	</thead>
	<tbody>
		{#each specIds as specId (specId)}
			<tr class="focus-within:table-row-checked">
				{#await getSpec(specId)}
					Loading...
				{:then data}
					<td class="table-cell-fit">
						<div class="font-semibold mb-1 flex">
							<span class="mr-2 w-[150px] md:w-[300px] truncate inline-block">
								{data.name}
							</span>
							<a href={`/specifications/${data.id}`} class="anchor" target="_blank">
								<i class="fa-solid fa-up-right-from-square text-sm h-3" />
							</a>
						</div>
						<div class="truncate w-[170px] md:w-[320px]">
							{data.description}
						</div>
					</td>
					<td class="">
						<input type="number" bind:value={specValues[specId]} class="input" {readonly} />
					</td>
					<td class="table-cell-fit !pl-0">
						<div class="whitespace-nowrap mt-2 w-[120px] md:w-[150px] text-center truncate">
							{data.unit}
						</div>
					</td>
				{:catch e}
					{#if e.code === 'PGRST116'}
						Error: Spec not found
					{:else}
						Error: Failed to get spec
					{/if}
				{/await}
			</tr>
		{:else}
			<tr>
				<td />
				<td class="w-full">No specifications provided</td>
				<td />
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.table tbody tr:nth-child(even) {
		background-color: transparent;
	}
</style>
