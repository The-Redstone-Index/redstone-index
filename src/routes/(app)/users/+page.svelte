<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import UserCard from '$lib/display/UserCard.svelte';
	import { Paginator, getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data;

	let { users, count, query, offset, limit, supabase, error } = data;
	$: ({ users, count, query, offset, limit, supabase, error } = data);

	let searchQuery = query;

	$: if (error) {
		toastStore.trigger({
			message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
			background: 'variant-filled-error',
			classes: 'pl-8'
		});
	}

	async function handleSearch() {
		const newSearchParams = $page.url.searchParams;
		if (searchQuery) newSearchParams.set('query', searchQuery);
		else newSearchParams.delete('query');
		newSearchParams.set('offset', offset.toString());
		newSearchParams.set('limit', limit.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
	}

	async function onAmountChange(e: CustomEvent) {
		const newAmount = e.detail as number;
		limit = newAmount;
		const newSearchParams = $page.url.searchParams;
		newSearchParams.set('limit', limit.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
	}

	async function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
		const newSearchParams = $page.url.searchParams;
		newSearchParams.set('offset', offset.toString());
		goto(`?${newSearchParams.toString()}`, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Users - The Redstone Index</title>
	<meta name="description" content="Find users on The Redstone Index." />
</svelte:head>

<div class="container min-h-[calc(100vh-12rem)] mx-auto p-4 mb-5 flex flex-col gap-10 mt-10">
	<!-- Heading -->
	<div class="flex justify-between items-center">
		<h1 class="h1">Users</h1>
	</div>

	<!-- Search input -->
	<form class="flex gap-3" on:submit|preventDefault={handleSearch}>
		<input
			type="search"
			class="input"
			placeholder="Search by username..."
			bind:value={searchQuery}
		/>
		<button class="btn-icon variant-filled-primary" type="submit">
			<i class="fa-solid fa-magnifying-glass" />
		</button>
	</form>

	<!-- List of users -->

	{#if users}
		{#if users.length === 0}
			<div class="grid place-items-center h-96 opacity-50">No users found!</div>
		{:else}
			<div class="flex gap-5 flex-wrap">
				{#each users as user}
					<UserCard {supabase} {user} />
				{/each}
			</div>
		{/if}
	{:else}
		<div class="grid place-items-center h-96">
			<i class="fa-solid fa-circle-exclamation w-60 text-8xl animate-pulse text-error-600" />
		</div>
	{/if}

	<!-- Pagination -->
	<div class="flex-1" />
	<Paginator
		settings={{ amounts: [25, 50, 100], page: Math.floor(offset / limit), limit, size: count }}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
