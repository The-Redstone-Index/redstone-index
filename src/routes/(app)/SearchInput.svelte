<script>
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let searchQuery = '';

	onMount(() => {
		return page.subscribe((p) => {
			if (p.route.id === '/(app)/search') searchQuery = p.url.searchParams.get('query') ?? '';
		});
	});

	beforeNavigate((navigation) => {
		if (navigation.to?.route.id !== '/(app)/search') searchQuery = '';
	});
</script>

<form
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
				on:click={() => {
					searchQuery = '';
					if ($page.route.id === '/(app)/search') {
						const newSearchParams = $page.url.searchParams;
						newSearchParams.delete('query');
						goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
					}
				}}
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
