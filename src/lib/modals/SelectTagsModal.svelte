<script lang="ts">
	import { getSearchedTags } from '$lib/api';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { getModalStore, popup, storePopup } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { flip } from 'svelte/animate';

	const modalStore = getModalStore();

	const limit = 7;
	const offset = 0;
	let searchQuery = '';
	let selectedTags = ($modalStore[0].meta.tags as Tables<'tags'>[]) ?? [];
	$: selectedTagIds = selectedTags.map((t) => t.id);
	let supabase = $modalStore[0].meta.supabase as SupabaseClient;
	let query = getSearchedTags(supabase, searchQuery, 0, limit);

	function onSelect() {
		$modalStore[0].response?.([1, 2, 3]);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function handleSearch() {
		query = getSearchedTags(supabase, searchQuery, offset, limit);
	}

	function handleClickTag(clickedTag: Tables<'tags'>) {
		const alreadyPresent = selectedTagIds.includes(clickedTag.id);
		if (alreadyPresent) selectedTags = selectedTags.filter((t) => t.id !== clickedTag.id);
		else selectedTags = [...selectedTags, clickedTag];
	}

	const debouncedSearch = debounce(handleSearch, 300);
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
											<td>{tag.name}</td>
											<td>{tag.description}</td>
											<td>{tag.usage_count}</td>
											<td>{tag.parent ? `Parent: ${tag.parent?.name}` : ''}</td>
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
				<div>
					<div>Recommended</div>
					{#each [1] as tag (tag)}
						<button class="chip variant-filled-primary px-1">
							Piston Trapdoor
							<i class="fa-solid fa-up-right-from-square" />
							<i class="fa-solid fa-square-up-right" />
						</button>
					{:else}
						<span class="opacity-50">None</span>
					{/each}
					<!-- !!!!!! -->
					<!-- Test -->
					<button class="chip variant-filled-primary gap-1 px-1.5 py-1">
						<i class="fas fa-tag" />
						Piston Trapdoor ({2000000})
						<!-- <div class="badge variant-filled h-5 !m-0">12</div> -->
						<a
							href="/tags/1"
							target="_blank"
							class="badge variant-filled h-5 !m-0"
							on:click={modalStore.close}
						>
							<i class="fa-solid fa-up-right-from-square text-sm" />
						</a>
					</button>
					<!-- !!!!!! -->
				</div>
			{/if}
		</div>

		<!-- Selected -->
		<div>
			<div>Selected:</div>
			<div class="flex gap-2 w-full">
				{#each selectedTags as tag (tag.id)}
					<button class="chip variant-filled-primary px-1" animate:flip={{ duration: 250 }}>
						<div>{tag.name}</div>
						<button class="h-5 w-5 g-blue-500" on:click={() => handleClickTag(tag)}>
							<i class="fa-solid fa-xmark" />
						</button>
					</button>
				{:else}
					<span class="opacity-50">None</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
