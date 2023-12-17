<script lang="ts">
	import { getSearchedTags } from '$lib/api/tags';
	import TagChip from '$lib/chips/TagChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { supabaseStore } from '$lib/stores';
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

	let selectedTagIds = ($modalStore[0].meta.tagIds as number[]) ?? [];

	let searchQuery = '';
	let query = getSearchedTags(supabase, searchParams);

	let selectedTags: Tables<'tags'>[] = [];
	let recommendedTags: Tables<'tags'>[] = [];
	let mostUsedTags: Tables<'tags'>[] = [];

	function onSelect() {
		$modalStore[0].response?.(selectedTagIds.length ? selectedTagIds : null);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function handleSearch() {
		query = getSearchedTags(supabase, {
			...searchParams,
			search: searchQuery || undefined
		});
	}

	function handleClickTag(clickedTag: Tables<'tags'>) {
		const alreadyPresent = selectedTagIds.includes(clickedTag.id);
		if (alreadyPresent) selectedTagIds = selectedTagIds.filter((id) => id !== clickedTag.id);
		else selectedTagIds = [...selectedTagIds, clickedTag.id];
	}

	const debouncedSearch = debounce(handleSearch, 300);

	onMount(async () => {
		const baseQuery = supabase
			.from('tags')
			.select('*')
			.order('usage_count', { ascending: false })
			.order('name');
		baseQuery.limit(20).then(({ data, error }) => {
			if (error) return console.error(error);
			if (data) mostUsedTags = data;
		});
		baseQuery
			.eq('recommended', true)
			.limit(10)
			.then(({ data, error }) => {
				if (error) return console.error(error);
				if (data) recommendedTags = data;
			});
	});

	$: {
		supabase
			.from('tags')
			.select('*')
			.in('id', selectedTagIds)
			.then(({ data, error }) => {
				if (error) return console.error(error);
				if (data) selectedTags = data;
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
			placeholder="Search tags..."
			bind:value={searchQuery}
			on:input={debouncedSearch}
		/>

		<!--  -->
		<div class="flex-1 g-red-500">
			{#if searchQuery}
				{#await query}
					<LoadingSpinnerArea />
				{:then [tags, err, count]}
					{#if tags}
						<!-- Show Table -->
						<div>{count} results</div>
						<div class="table-container">
							<table class="table table-hover table-compact relative">
								<tbody>
									{#each tags as tag}
										{@const checked = selectedTagIds.includes(tag.id)}
										<tr
											class:table-row-checked={checked}
											on:click={() => handleClickTag(tag)}
											class="cursor-pointer"
										>
											<td>
												<input class="checkbox" type="checkbox" {checked} />
											</td>
											<td>
												{tag.name}
												<a href={`/tags/${tag.id}`} target="_blank" class="anchor mx-1">
													<i
														class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100 hover:font-semibold"
													/>
												</a>
											</td>
											<td>{tag.description}</td>
											<td>({tag.usage_count})</td>
											<td>
												{#if tag.parent}
													Parent:
													<a href={`/tags/${tag.id}`} target="_blank" class="anchor mx-1">
														{tag.parent.name}
													</a>
												{/if}
											</td>
										</tr>
									{:else}
										<div class="h-60 grid place-items-center opacity-50 font-semibold">No Tags</div>
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
					<!-- Recommended -->
					<div>
						<div class="mb-1">Recommended:</div>
						<div class="flex gap-2 flex-wrap">
							{#each recommendedTags as tag (tag.id)}
								{@const selected = selectedTagIds.includes(tag.id)}
								<TagChip {tag} showLink on:click={() => handleClickTag(tag)} {selected} />
							{:else}
								<span class="opacity-50">None</span>
							{/each}
						</div>
					</div>

					<!-- Most used -->
					<div>
						<div class="mb-1">Most used:</div>
						<div class="flex gap-2 flex-wrap">
							{#each mostUsedTags as tag (tag.id)}
								{@const selected = selectedTagIds.includes(tag.id)}
								<TagChip {tag} showCount showLink on:click={() => handleClickTag(tag)} {selected} />
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
				{#each selectedTags as tag (tag.id)}
					<div animate:flip={{ duration: 400 }} out:fade={{ duration: 100 }}>
						<TagChip {tag} on:delete={() => handleClickTag(tag)} showDelete />
					</div>
				{:else}
					<span class="opacity-50">None Selected</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if selectedTags.length}
				<button class="btn hover:variant-soft" on:click={() => (selectedTagIds = [])} type="button">
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
