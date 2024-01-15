<script lang="ts">
	import SpecificationChip from '$lib/chips/SpecificationChip.svelte';
	import TagChip from '$lib/chips/TagChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getSearchedSpecs } from '$lib/supabase-api/specifications';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	const modalStore = getModalStore();
	const supabase = $supabaseStore;

	const searchParams = {
		limit: 7,
		offset: 0,
		sortBy: 'usage_count',
		sortAscending: false
	} as const;

	let selectedSpecIds = ($modalStore[0].meta.specIds as number[]) ?? [];

	let searchQuery = '';
	let query = getSearchedSpecs(supabase, searchParams);

	let selectedSpecs: Tables<'specifications'>[] = [];
	let mostUsedSpecs: Tables<'specifications'>[] = [];

	function onSelect() {
		$modalStore[0].response?.(selectedSpecIds);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function handleSearch() {
		query = getSearchedSpecs(supabase, {
			...searchParams,
			search: searchQuery || undefined
		});
	}

	function handleClickSpec(clickedSpec: Tables<'specifications'>) {
		const alreadyPresent = selectedSpecIds.includes(clickedSpec.id);
		if (alreadyPresent) selectedSpecIds = selectedSpecIds.filter((id) => id !== clickedSpec.id);
		else selectedSpecIds = [...selectedSpecIds, clickedSpec.id];
	}

	const debouncedSearch = debounce(handleSearch, 300);

	onMount(async () => {
		const baseQuery = supabase
			.from('specifications')
			.select('*')
			.order('usage_count', { ascending: false })
			.order('name');
		baseQuery.limit(20).then(({ data, error }) => {
			if (error) return console.error(error);
			if (data) mostUsedSpecs = data;
		});
	});

	$: {
		supabase
			.from('specifications')
			.select('*')
			.in('id', selectedSpecIds)
			.then(({ data, error }) => {
				if (error) return console.error(error);
				if (data) selectedSpecs = data;
			});
	}
</script>

<div class="card px-10 py-6 w-modal-wide h-[43rem]">
	<div class="flex flex-col gap-6 h-full">
		<header class="text-3xl">Select Tags</header>

		<!-- Search -->
		<input
			type="text"
			class="input"
			placeholder="Search specifications..."
			bind:value={searchQuery}
			on:input={debouncedSearch}
		/>

		<!--  -->
		<div class="flex-1 g-red-500">
			{#if searchQuery}
				{#await query}
					<LoadingSpinnerArea />
				{:then [specs, err, count]}
					{#if specs}
						<!-- Show Table -->
						<div>{count} results</div>
						<div class="table-container">
							<table class="table table-hover table-compact relative">
								<tbody>
									{#each specs as spec}
										{@const checked = selectedSpecIds.includes(spec.id)}
										<tr
											class:table-row-checked={checked}
											on:click={() => handleClickSpec(spec)}
											class="cursor-pointer"
										>
											<td>
												<input class="checkbox" type="checkbox" {checked} />
											</td>
											<td>
												{spec.name}
												<a href={`/specifications/${spec.id}`} target="_blank" class="anchor mx-1">
													<i
														class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100 hover:font-semibold"
													/>
												</a>
											</td>
											<td>{spec.description}</td>
											<td>({spec.usage_count})</td>
											<td>{spec.unit}</td>
										</tr>
									{:else}
										<div class="h-60 grid place-items-center opacity-50 font-semibold">
											No Specs
										</div>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
					{#if err}
						{err.message}
					{/if}
				{/await}
			{:else}
				<!-- Show Chips -->

				<div class="flex flex-col justify-evenly h-full">
					<!-- Most used -->
					<div>
						<div class="mb-1">Most used:</div>
						<div class="flex gap-2 flex-wrap">
							{#each mostUsedSpecs as spec (spec.id)}
								{@const selected = selectedSpecIds.includes(spec.id)}
								<SpecificationChip
									{spec}
									showCount
									showLink
									on:click={() => handleClickSpec(spec)}
									{selected}
								/>
							{:else}
								<span class="opacity-50">None</span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Selected -->
		<hr />
		<div class="overflow-y-auto">
			<div class="mb-1">Tags Required:</div>
			<div class="flex gap-2 w-full flex-wrap">
				{#each selectedSpecs as spec (spec.id)}
					<div animate:flip={{ duration: 400 }} out:fade={{ duration: 100 }}>
						<SpecificationChip {spec} on:delete={() => handleClickSpec(spec)} showDelete />
					</div>
				{:else}
					<span class="opacity-50">None Selected</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if selectedSpecs.length}
				<button
					class="btn hover:variant-soft"
					on:click={() => (selectedSpecIds = [])}
					type="button"
				>
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
