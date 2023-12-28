<script lang="ts">
	import { getSearchedUsers } from '$lib/api/users';
	import UserChip from '$lib/chips/UserChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';

	const modalStore = getModalStore();
	const supabase = $supabaseStore;

	const searchParams = {
		limit: 6,
		offset: 0
	} as const;

	let user = ($modalStore[0].meta.user as Tables<'users'> | null) ?? null;
	let searchText = '';
	let searchQuery = getSearchedUsers(supabase, searchParams);

	function handleSearch() {
		searchQuery = getSearchedUsers(supabase, { ...searchParams, search: searchText });
	}

	const debouncedSearch = debounce(handleSearch, 300);

	function onSubmit() {
		$modalStore[0].response?.(user?.username);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function handleClickUser(clickedUser: Tables<'users'>) {
		if (clickedUser.id === user?.id) user = null;
		else user = clickedUser;
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select User</header>

		<div class="flex flex-col gap-3">
			<!-- Search -->
			<input
				type="text"
				class="input"
				placeholder="Search users..."
				bind:value={searchText}
				on:input={debouncedSearch}
			/>

			<!-- Block list -->
			{#await searchQuery}
				<LoadingSpinnerArea />
			{:then [users, err, count]}
				<div>
					{count} results
				</div>
				<div class="flex flex-wrap gap-3 justify-center">
					{#if users}
						{#each users as user}
							<UserChip {user} on:click={() => handleClickUser(user)} />
						{:else}
							<div class="h-60 grid place-items-center opacity-50 font-semibold">No Users</div>
						{/each}
					{/if}
					{#if err}
						{err.message}
					{/if}
				</div>
			{/await}
		</div>

		<!-- Selected -->
		<hr />
		<div class="overflow-y-auto">
			<div class="mb-1">
				<span class="mr-3">Selected user:</span>
				{#if user}
					{user.username}
				{:else}
					<span class="opacity-50">None Selected</span>
				{/if}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if user}
				<button class="btn hover:variant-soft" on:click={() => (user = null)} type="button">
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSubmit} type="button">Confirm</button>
		</div>
	</div>
</div>
