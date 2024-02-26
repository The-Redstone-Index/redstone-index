<script>
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let searchQuery = '';
	const searchScreenRouteId = '/(app)/(content)/search';

	// Populate the search field value with query string if currently on the search screen
	onMount(() => {
		return page.subscribe((p) => {
			if (p.route.id === searchScreenRouteId) {
				searchQuery = p.url.searchParams.get('query') ?? '';
			}
		});
	});

	// Clear search field value if navigating away from the search screen
	beforeNavigate((navigation) => {
		if (navigation.to?.route.id !== searchScreenRouteId) {
			searchQuery = '';
		}
	});

	// Clear search field value & refresh page if currently on the search screen
	function handleClearSearchField() {
		searchQuery = '';
		if ($page.route.id === searchScreenRouteId) {
			const newSearchParams = $page.url.searchParams;
			newSearchParams.delete('query');
			goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
		}
	}
</script>

<form
	action="/search"
	class="input-group grid-cols-[auto_1fr_auto] items-center"
	on:submit|preventDefault={() => {
		const newSearchParams = $page.url.searchParams;
		newSearchParams.delete('query');
		if (searchQuery.trim()) newSearchParams.set('query', searchQuery);
		goto(`/search?${newSearchParams.toString()}`, { invalidateAll: true });
	}}
>
	<div><i class="fa-solid fa-magnifying-glass" /></div>
	<input
		type="text"
		placeholder="Search..."
		name="query"
		class="input"
		bind:value={searchQuery}
		autocomplete="off"
	/>
	<div class="flex gap-1 !pl-0 !pr-1" transition:fade={{ duration: 200 }}>
		{#if searchQuery}
			<button
				class="btn-icon btn-icon-sm hover:variant-soft-surface !p-0"
				type="button"
				on:click={handleClearSearchField}
			>
				<i class="fa-solid fa-xmark mx-auto" />
			</button>
		{/if}
		<button
			class="btn btn-sm h-8 variant-filled-primary cursor-pointer !hidden sm:!block md:!hidden lg:!block"
		>
			search
		</button>
		<button
			class="btn-icon btn-icon-sm h-8 variant-filled-primary cursor-pointer !flex sm:!hidden md:!flex lg:!hidden !justify-center"
		>
			<i class="fa-solid fa-magnifying-glass" />
		</button>
	</div>
</form>
