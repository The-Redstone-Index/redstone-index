<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { PUBLIC_ENVIRONMENT_NAME } from '$env/static/public';
	import GlowingRedstoneLogo from '$lib/common/GlowingRedstoneLogo.svelte';
	import { deleteAllNotifications, deleteNotification } from '$lib/supabase-api/notifications';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
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
	import SearchInput from './SearchInput.svelte';

	export let user: SelfUser | undefined;
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
		},
		closeQuery: '#will-close'
	};

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const dispatch = createEventDispatcher();

	function invalidateUser() {
		// For refreshing notifications on click
		invalidate((x) => x.pathname === '/rest/v1/users');
	}
</script>

<AppBar>
	<!-- Title -->
	<svelte:fragment slot="lead">
		<a href="/" class="flex gap-3 justify-center">
			<div class="relative grid place-items-center">
				<GlowingRedstoneLogo pulse size="sm" />
				{#if PUBLIC_ENVIRONMENT_NAME != 'PRODUCTION'}
					<div
						class="absolute text-[0.5em] opacity-80 bg-green-500 text-white px-0.5 font-bold leading-snug"
					>
						{PUBLIC_ENVIRONMENT_NAME || '???'}
					</div>
				{/if}
			</div>
			<div class="relative self-center text-center uppercase">
				<b class="absolute -top-[0.7em] opacity-50 dark:opacity-80 text-[0.7em] w-full">The</b>
				<b class="text-xl uppercase text-redstone leading-9">Redstone Index</b>
			</div>
		</a>
	</svelte:fragment>
	<!-- Search -->
	<div class="justify-center hidden md:flex">
		<div class="max-w-2xl w-full">
			<SearchInput />
		</div>
	</div>
	<svelte:fragment slot="headline">
		<div class="md:hidden mt-3">
			<SearchInput />
		</div>
	</svelte:fragment>

	<!-- Actions -->
	<svelte:fragment slot="trail">
		<div class="flex gap-2 items-center">
			{#if user}
				<a
					class="btn-icon grid items-center hover:variant-soft-surface"
					href="/users/{user.numeric_id}"
					aria-label="Go to My Things"
				>
					<i class="fa-solid fa-cube" />
				</a>
				<div class="relative inline-block">
					{#if user.notifications.length}
						<span
							class="badge-icon scale-90 variant-filled-warning absolute -top-0 -left-0 z-10 pointer-events-none"
						>
							{user.notifications.length}
						</span>
					{/if}
					<button
						class="btn-icon items-center hover:variant-soft-surface"
						type="button"
						use:popup={notificationsMenuPopupSettings}
						on:click={invalidateUser}
					>
						<i class="fas fa-bell" />
					</button>
				</div>
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
				<LightSwitch class="mr-0" />
				<a class="btn px-3 !ml-1 flex gap-1 hover:variant-soft-surface" href="/signin">Sign In</a>
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
				<div class="truncate">{user?.username}</div>
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
				<div class="flex-1" />
				<button
					type="button"
					class="btn-sm"
					on:click|stopPropagation={() => deleteAllNotifications(supabase, user?.id ?? '')}
				>
					clear all
				</button>
			</div>
		</li>
		<hr />
		<ul class="max-h-96 overflow-y-auto">
			{#each user?.notifications ?? [] as notif}
				<li class="">
					<a href={notif.link} class="flex !p-2 max-h-20 overflow-hidden">
						<div class="w-8 flex justify-center items-center">
							<i class={notif.icon} />
						</div>
						<div class="flex flex-1 p-1">
							<div class="text-sm whitespace-normal">
								{notif.message}
							</div>
						</div>
						<button
							class="btn-icon btn-icon-sm"
							type="button"
							on:click|stopPropagation|preventDefault={() => deleteNotification(supabase, notif.id)}
						>
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
	</ul>
</nav>
