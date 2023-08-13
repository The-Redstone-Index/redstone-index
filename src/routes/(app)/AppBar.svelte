<script lang="ts">
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		AppBar,
		Avatar,
		LightSwitch,
		popup,
		storePopup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';

	let avatarMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'avatarMenuPopup',
		middleware: {
			offset: 24
		}
	};
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let signedIn: Boolean;

	let searchQuery = '';
</script>

<AppBar>
	<!-- Title -->
	<svelte:fragment slot="lead">
		<a href="/" class="flex gap-3 justify-center">
			<img src="/redstone_dust.webp" class="w-9" alt="Redstone Index Logo" />
			<strong class="text-xl uppercase hidden sm:inline self-center text-redstone">
				Redstone Index
			</strong>
		</a>
	</svelte:fragment>
	<!-- Search -->
	<div class="flex justify-center">
		<form class="input-group grid-cols-[auto_1fr_auto] max-w-xl" action={`/search`} method="get">
			<div><i class="fa-solid fa-magnifying-glass" /></div>
			<input
				type="search"
				placeholder="Search..."
				name="query"
				class="input"
				bind:value={searchQuery}
			/>
			<!-- TODO: Dropdown with additional parameters -->
			<!-- It will show while you are typing, and will be permanently shown if you are on the search screen -->
		</form>
	</div>
	<!-- Actions -->
	<svelte:fragment slot="trail">
		{#if signedIn}
			<a class="btn-icon hidden sm:grid items-center" href="/users/0" aria-label="Go to My Things">
				<i class="fa-solid fa-cube" />
			</a>
		{/if}
		<!-- <LightSwitch width="w-[3rem] hidden sm:block" /> -->
		{#if signedIn}
			<div use:popup={avatarMenuPopupSettings} class="!ml-0 sm:!ml-5">
				<Avatar
					width="w-12"
					border="border-2 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
					initials="plasmatech8"
				/>
			</div>
		{:else}
			<button class="btn">Sign In</button>
		{/if}
	</svelte:fragment>
</AppBar>

<!-- Avatar Popup Menu -->
<nav class="list-nav card p-1 w-60 shadow-xl" data-popup="avatarMenuPopup">
	<ul>
		<li class="">
			<a href={`/users/${0}`} class="focus:outline-none !px-6 !py-3 flex gap-2">
				<i class="far fa-user" />
				<div>plasmatech8</div>
			</a>
		</li>
		<hr />
		<li class="flex h-10 items-center">
			<LightSwitch class="ml-3 mr-5" />
			<span class="flex-auto">Toggle dark mode</span>
		</li>
		<hr />
		<li>
			<a href={`/users/${0}`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-cube text-white" />
				</span>
				<span class="flex-auto">My Things</span>
			</a>
		</li>
		<li>
			<a href={`/users/${0}/settings`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-gear text-white" />
				</span>
				<span class="flex-auto">Settings</span>
			</a>
		</li>
		<hr />
		<li>
			<a href={`/`} class="focus:outline-none" on:click={() => (signedIn = false)}>
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-right-from-bracket text-white" />
				</span>
				<span class="flex-auto">Sign Out</span>
			</a>
		</li>
	</ul>
</nav>