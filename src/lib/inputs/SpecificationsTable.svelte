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

	const numberPattern = /^-?[0-9]+(\.[0-9]+)?$/;

	function onInput(e: Event, specId: number) {
		const target = e.target as HTMLInputElement;
		if (target.value.match(numberPattern)) {
			specValues[specId] = Number(target.value);
		}
	}
</script>

<table class="table table-compact !table-hover">
	<thead class="text-left">
		<th class="min-w-[150px]">Name</th>
		<th>
			<div class="flex justify-between">
				<div class="flex items-center">Value</div>
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
							<a href={`/specifications/${data.id}`} class="anchor" target="_blank">
								<i class="fa-solid fa-up-right-from-square text-sm h-3" />
							</a>
							<span class="ml-2 w-[150px] md:w-[350px] lg:w-[550px] truncate inline-block">
								{data.name}
							</span>
						</div>
						<div class="truncate w-[170px] md:w-[370px] lg:w-[570px]">
							{data.description}
						</div>
					</td>
					<td class="">
						<input
							type="text"
							value={specValues[specId]}
							on:input={(e) => onInput(e, specId)}
							class="input"
							{readonly}
							pattern={numberPattern.source}
							maxlength={30}
							placeholder="Enter a Number... e.g. -0.01"
							required
						/>
					</td>
					<td class="table-cell-fit !pl-0">
						<div
							class="whitespace-nowrap mt-2 w-[100px] md:w-[130px] lg:w-[160px] text-center truncate"
						>
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
				<td class="w-full">
					<div class="p-6 text-center opacity-50">No specifications provided</div>
				</td>
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
