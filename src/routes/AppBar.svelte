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

	let exampleSettings: PopupSettings = {
		event: 'click',
		target: 'examplePopup',
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
			<img
				src="https://static.wikia.nocookie.net/thetekkit/images/3/31/Redstone.png"
				class="w-9"
				alt="Redstone Index Logo"
			/>
			<strong class="text-xl uppercase hidden sm:inline self-center ">Redstone Index</strong>
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
		</form>
	</div>
	<!-- Actions -->
	<svelte:fragment slot="trail">
		<button class="btn-icon hidden sm:block">
			<i class="fa-solid fa-plus" />
		</button>
		<LightSwitch width="w-[3rem] hidden sm:block" />
		{#if signedIn}
			<div use:popup={exampleSettings} class="!ml-0 sm:!ml-5">
				<Avatar
					src="https://i.pravatar.cc/"
					border="border-2 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
				/>
			</div>
		{:else}
			<button class="btn">Sign In</button>
		{/if}
	</svelte:fragment>
</AppBar>

<nav class="list-nav card p-1 w-60 shadow-xl" data-popup="examplePopup">
	<!-- (optionally you can provde a label here) -->
	<ul>
		<li class="">
			<a href={`/users/${0}`} class="focus:outline-none !block !px-6 !py-3">
				<div>username</div>
				<div class="!ml-0">email@example.com</div>
			</a>
		</li>
		<hr />
		<li>
			<a href={`/users/${0}/builds`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-hammer" />
				</span>
				<span class="flex-auto">Builds</span>
			</a>
		</li>
		<li>
			<a href={`/users/${0}/settings`} class="focus:outline-none">
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-gear" />
				</span>
				<span class="flex-auto">Settings</span>
			</a>
		</li>
		<hr />
		<li>
			<a href={`/`} class="focus:outline-none" on:click={() => alert('Signed Out')}>
				<span class="badge bg-primary-500 aspect-square">
					<i class="fa-solid fa-right-from-bracket" />
				</span>
				<span class="flex-auto">Sign Out</span>
			</a>
		</li>
	</ul>
</nav>
