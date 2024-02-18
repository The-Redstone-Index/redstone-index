<script lang="ts">
	import SpecificationChip from '$lib/chips/SpecificationChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { buildSortOptions } from '$lib/config';
	import { supabaseStore } from '$lib/stores';
	import { getSearchedSpecs } from '$lib/supabase-api/specifications';
	import type { SortConfig } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();
	const supabase = $supabaseStore;

	let sort =
		structuredClone($modalStore[0].meta.sort as SortConfig | { by: undefined; specId?: number }) ??
		{};
	let selectedSpecification: Tables<'specifications'> | null = null;

	let searchSpecInputEl: HTMLInputElement;
	let searchSpecificationsText = '';
	const searchParams = {
		limit: 6,
		offset: 0,
		sortBy: 'usage_count',
		sortAscending: false
	} as const;
	let searchSpecificationsQuery = getSearchedSpecs(supabase, searchParams);

	const debouncedSearchSpecifications = debounce(handleSearch, 300);

	function handleSearch() {
		searchSpecificationsQuery = getSearchedSpecs(supabase, {
			...searchParams,
			search: searchSpecificationsText || undefined
		});
	}

	function onConfirm() {
		if (sort.by === 'specification' && !selectedSpecification) {
			searchSpecInputEl.setCustomValidity('You need to select a specification to sort by.');
			searchSpecInputEl.reportValidity();
			return;
		}
		$modalStore[0].response?.(
			sort.by === undefined
				? null
				: `${sort.by}_${sort.ascending ? 'asc' : 'desc'}${sort.specId ? '_' + sort.specId : ''}`
		);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function onClear() {
		sort = { by: undefined };
		searchSpecificationsText = '';
		selectedSpecification = null;
	}

	function setSpec(spec: Tables<'specifications'> | null) {
		selectedSpecification = spec;
		sort.specId = spec?.id;
	}

	onMount(async () => {
		if (sort.specId) {
			const { data, error } = await supabase
				.from('specifications')
				.select('*')
				.eq('id', sort.specId)
				.single();
			selectedSpecification = data;
			if (error) console.error(error);
		}
	});
</script>

<div class="card px-10 py-6 w-modal" class:w-modal-wide={sort?.by === 'specification'}>
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Sort By</header>

		<div class="flex gap-3 flex-col">
			<div class="flex gap-5">
				<!-- Select for Sorting Option -->
				<select bind:value={sort.by} class="select">
					<option value={undefined} disabled selected>Select Sorting Option...</option>
					{#each Object.entries(buildSortOptions) as [key, option]}
						<option value={key}>{option.name}</option>
					{/each}
				</select>

				<!-- Select for Sorting Direction -->
				{#if sort?.by}
					<select bind:value={sort.ascending} class="select" required>
						<option value={true} selected>{buildSortOptions[sort.by].ascending}</option>
						<option value={false}>{buildSortOptions[sort.by].descending}</option>
					</select>
				{/if}
			</div>

			<!-- Search for specification -->
			{#if sort.by === 'specification'}
				<div class="flex gap-2">
					Selected:
					{#if selectedSpecification}
						<SpecificationChip
							spec={selectedSpecification}
							showCount
							showLink
							showDelete
							on:delete={() => setSpec(null)}
						/>
					{:else}
						<span class="opacity-50">No specification selected</span>
					{/if}
				</div>

				<hr class="my-2" />

				<input
					type="text"
					class="input"
					placeholder="Search specifications..."
					bind:value={searchSpecificationsText}
					on:input={debouncedSearchSpecifications}
					bind:this={searchSpecInputEl}
				/>

				<div class="min-h-[20rem]">
					{#await searchSpecificationsQuery}
						<LoadingSpinnerArea />
					{:then [specs, err, count]}
						{#if specs}
							<!-- Show Table -->
							<div>{count} results</div>
							<div class="table-container">
								<table class="table table-hover table-compact relative">
									<tbody>
										{#each specs as spec}
											<tr
												on:click={() => setSpec(spec)}
												class="cursor-pointer"
												class:table-row-checked={selectedSpecification?.id === spec.id}
											>
												<td>
													{spec.name}
													<a
														href={`/specifications/${spec.id}`}
														target="_blank"
														class="anchor mx-1"
													>
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
				</div>
			{/if}
		</div>

		<div class="flex justify-end gap-3">
			{#if sort.by}
				<button class="btn hover:variant-soft" on:click={onClear} type="button">Clear</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onConfirm} type="button">Confirm</button>
		</div>
	</div>
</div>
