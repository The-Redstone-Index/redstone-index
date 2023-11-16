<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_ENVIRONMENT_NAME } from '$env/static/public';
	import { getAvatarUrl } from '$lib/api';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		AppBar,
		Avatar,
		LightSwitch,
		popup,
		storePopup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let user: Tables<'users'> | undefined;
	export let supabase: SupabaseClient;

	let avatarMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'avatarMenuPopup',
		middleware: {
			offset: 24
		}
	};

	let notificationsMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'notificationsMenuPopup',
		middleware: {
			offset: 26
		}
	};

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const dispatch = createEventDispatcher();

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

<AppBar>
	<!-- Title -->
	<svelte:fragment slot="lead">
		<a href="/" class="flex gap-3 justify-center">
			<div class="relative grid place-items-center">
				{#if PUBLIC_ENVIRONMENT_NAME != 'PRODUCTION'}
					<div
						class="absolute text-[0.5em] opacity-80 bg-green-500 text-white px-0.5 font-bold leading-snug"
					>
						{PUBLIC_ENVIRONMENT_NAME || '???'}
					</div>
				{/if}
				<img src="/redstone_dust.webp" class="w-9" alt="Redstone Index Logo" />
			</div>
			<div class="relative hidden sm:inline self-center text-center uppercase">
				<b class="absolute -top-[0.7em] opacity-30 text-[0.7em] w-full">The</b>
				<b class="text-xl uppercase text-redstone leading-9">Redstone Index</b>
			</div>
		</a>
	</svelte:fragment>
	<!-- Search -->
	<div class="flex justify-center">
		<form
			class="input-group grid-cols-[auto_1fr_auto] max-w-xl items-center"
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
				<button class="btn btn-sm h-8 variant-filled-primary cursor-pointer">search</button>
			</div>

			<!-- TODO: Dropdown with additional parameters -->
			<!-- It will show while you are typing, and will be permanently shown if you are on the search screen -->
		</form>
	</div>
	<!-- Actions -->
	<svelte:fragment slot="trail">
		<div class="flex gap-2 items-center">
			{#if user}
				<a
					class="btn-icon hidden sm:grid items-center hover:variant-soft-surface"
					href="/users/{user.numeric_id}"
					aria-label="Go to My Things"
				>
					<i class="fa-solid fa-cube" />
				</a>
				<button
					class="btn-icon items-center hover:variant-soft-surface"
					use:popup={notificationsMenuPopupSettings}
				>
					<i class="fas fa-bell" />
				</button>
			{/if}
			<!-- <LightSwitch width="w-[3rem] hidden sm:block" /> -->
			{#if user}
				<div use:popup={avatarMenuPopupSettings}>
					<Avatar
						width="w-12"
						border="border-2 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer"
						initials={user.username}
						src={getAvatarUrl(supabase, user.avatar_path)}
					/>
				</div>
			{:else}
				<LightSwitch class="mr-0 ml-2" />
				<a class="btn !ml-1" href="/signin">Sign In</a>
			{/if}
		</div>
	</svelte:fragment>
</AppBar>

<!-- Avatar Popup Menu -->
<nav class="list-nav card p-1 w-64 shadow-xl" data-popup={avatarMenuPopupSettings.target}>
	<ul>
		<li class="">
			<div class="focus:outline-none !px-6 !py-3 flex gap-4 align-middle items-center">
				<i class="fas fa-user" />
				<div>{user?.username}</div>
			</div>
		</li>
		<hr />
		<li class="flex h-10 items-center">
			<LightSwitch class="ml-3 mr-5" />
			<span class="flex-auto">Toggle dark mode</span>
		</li>
		<hr />
		<li>
			<a href={`/users/${user?.numeric_id}`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-cube text-white" />
				</span>
				<span class="flex-auto">My Things</span>
			</a>
		</li>
		<li>
			<a href={`/settings`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-gear text-white" />
				</span>
				<span class="flex-auto">Settings</span>
			</a>
		</li>
		<hr />
		<li>
			<button class="focus:outline-none w-full text-left" on:click={() => dispatch('signOut')}>
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-right-from-bracket text-white" />
				</span>
				<span class="flex-auto">Sign Out</span>
			</button>
		</li>
	</ul>
</nav>

<!-- Notifications Popup Menu -->
<nav class="list-nav card p-1 w-96 shadow-xl" data-popup={notificationsMenuPopupSettings.target}>
	<ul>
		<li class="">
			<div class="focus:outline-none !px-6 !py-3 flex gap-4 align-middle items-center">
				<i class="fas fa-bell" />
				<div>Notifications</div>
			</div>
		</li>
		<hr />
		{#each [] as notif}
			<li>
				<a href="/something" class="flex !p-2">
					<div class="flex flex-1 p-1">
						<div class="text-sm whitespace-normal">
							{notif}
						</div>
					</div>
					<button class="btn-icon btn-icon-sm" on:click|stopPropagation|preventDefault>
						<i class="fa-solid fa-xmark" />
					</button>
				</a>
			</li>
		{:else}
			<li class="">
				<div class="focus:outline-none grid place-items-center h-28 opacity-50">
					<div>No notifications!</div>
				</div>
			</li>
		{/each}
	</ul>
</nav>
