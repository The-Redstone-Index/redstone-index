<script lang="ts">
	import { getAvatarUrl, getSearchedUsers } from '$lib/api.js';
	import UserCard from '$lib/display/UserCard.svelte';
	import { Avatar, Paginator, getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data;

	let { users, count, supabase } = data;
	$: ({ users, count, supabase } = data);

	let searchTerms = '';
	let offset = 0;
	let limit = 50;

	async function handleSearch() {
		const [newUsers, error, newCount] = await getSearchedUsers(
			supabase,
			searchTerms || null,
			offset,
			limit
		);
		if (error) {
			if (error.code === 'PGRST103') {
				offset = 0;
				return handleSearch();
			}
			return toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		}
		users = newUsers;
		count = newCount;
	}

	async function onAmountChange(e: CustomEvent) {
		const newAmount = e.detail as number;
		limit = newAmount;
		handleSearch();
	}

	async function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
		handleSearch();
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
			bind:value={searchTerms}
		/>
		<button class="btn-icon variant-filled-primary" type="submit">
			<i class="fa-solid fa-magnifying-glass" />
		</button>
	</form>

	<!-- List of tags -->
	<div class="flex gap-5 flex-wrap">
		{#each users as user}
			<UserCard {supabase} {user} />
		{/each}
	</div>

	<!-- Pagination -->
	<div class="flex-1" />
	<Paginator
		settings={{ amounts: [25, 50, 100], page: 0, limit: 50, size: count }}
		on:page={onPageChange}
		on:amount={onAmountChange}
	/>
</div>
