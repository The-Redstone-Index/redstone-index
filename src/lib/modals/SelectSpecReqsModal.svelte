<script lang="ts">
	import { getSearchedSpecs } from '$lib/api/specifications';
	import SpecificationChip from '$lib/chips/SpecificationChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import type { SpecRequirement } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	const modalStore = getModalStore();

	let supabase = $modalStore[0].meta.supabase as SupabaseClient;
	let specReqs = ($modalStore[0].meta.specReqs as SpecRequirement[]) ?? [];

	const searchParams = {
		limit: 6,
		offset: 0,
		sortBy: 'usage_count',
		sortAscending: false
	} as const;

	let searchText = '';
	let searchQuery = getSearchedSpecs(supabase, searchParams);

	const mostUsedSpecsQuery = supabase
		.from('specifications')
		.select('*')
		.limit(10)
		.order('usage_count', { ascending: false })
		.order('name')
		.then(({ data, error }) => {
			if (error) throw error;
			return data;
		});
	let selectedSpecsInfo: { [key: number]: Tables<'specifications'> } = {};
	$: {
		supabase
			.from('specifications')
			.select('*')
			.in(
				'id',
				specReqs.map((sr) => sr.id)
			)
			.then(({ data, error }) => {
				if (error) return console.error(error);
				selectedSpecsInfo = data.reduce<{ [key: number]: Tables<'specifications'> }>(
					(agg, next) => {
						agg[next.id] = next;
						return agg;
					},
					{}
				);
			});
	}

	function handleSearch() {
		searchQuery = getSearchedSpecs(supabase, {
			...searchParams,
			search: searchText || undefined
		});
	}

	function handleClickSpec(clickedSpec: Tables<'specifications'>) {
		console.log(clickedSpec);
		const alreadyPresent = specReqs.map((sr) => sr.id).includes(clickedSpec.id);
		if (alreadyPresent) specReqs = specReqs.filter((sr) => sr.id !== clickedSpec.id);
		else specReqs = [...specReqs, { id: clickedSpec.id, op: 'gt' }];
	}

	const debouncedSearch = debounce(handleSearch, 300);

	function onSelect() {
		$modalStore[0].response?.(specReqs.map(formatToSpecReqString));
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function formatToSpecReqString(specReq: SpecRequirement) {
		return `${specReq.id}_${specReq.op}_${specReq.val ?? 0}`;
	}
</script>

<div class="card px-10 py-6 w-modal-wide">
	<div class="flex flex-col gap-10 h-full">
		<header class="text-3xl">Select Specifications</header>

		<div class="flex flex-col gap-3">
			<!-- Search -->
			<input
				type="text"
				class="input"
				placeholder="Search specifications..."
				bind:value={searchText}
				on:input={debouncedSearch}
			/>

			<!--  -->
			<div class="flex-1 g-red-500">
				{#if searchText}
					{#await searchQuery}
						<LoadingSpinnerArea />
					{:then [specs, err, count]}
						{#if specs}
							<!-- Show Table -->
							<div>{count} results</div>
							<div class="table-container">
								<table class="table table-hover table-compact relative">
									<tbody>
										{#each specs as spec}
											{@const checked = specReqs.map((sr) => sr.id).includes(spec.id)}
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
				{:else}
					<!-- Show Chips -->
					<div class="flex flex-col justify-evenly h-full">
						<!-- Most used specifications-->
						<div>
							<div class="mb-1">Most used:</div>
							<div class="flex gap-2 flex-wrap">
								{#await mostUsedSpecsQuery}
									<LoadingSpinnerArea />
								{:then mostUsedSpecs}
									{#each mostUsedSpecs as spec (spec.id)}
										{@const selected = specReqs.map((sr) => sr.id).includes(spec.id)}
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
								{:catch err}
									{err}
								{/await}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Selected -->
		<hr />
		<div>
			<div class="mb-1">Specifications & Requirements:</div>
			<div class="flex flex-col gap-2">
				{#each specReqs as specReq (specReq.id)}
					{@const specInfo = selectedSpecsInfo[specReq.id] ?? null}
					<div class="input-group input-group-divider grid-cols-12" in:fade={{ duration: 300 }}>
						<div class="input-group-shim col-span-5">{specInfo?.name ?? '...'}</div>
						<select bind:value={specReq.op}>
							<option class="" value="lt">&lt;</option>
							<option value="gt">&gt;</option>
							<option value="eq">=</option>
						</select>

						<input type="text" class="col-span-3" placeholder="0" bind:value={specReq.val} />
						<div class="input-group-shim col-span-3 flex !justify-between !pr-1">
							<span class:opacity-50={!specInfo?.unit}>
								{specInfo?.unit ?? 'No unit'}
							</span>
							<button
								type="button"
								class="btn-icon btn-icon-sm hover:variant-filled-error flex !justify-center"
								on:click={() => handleClickSpec(specInfo)}
							>
								<i class="fa-solid fa-trash" />
							</button>
						</div>
					</div>
				{:else}
					<span class="opacity-50">None Selected</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if specReqs.length}
				<button class="btn hover:variant-soft" on:click={() => (specReqs = [])} type="button">
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
