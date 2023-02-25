<script lang="ts">
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import { AppBar, AppShell, Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '../app.postcss';

	let signedIn = true;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<!-- Title -->
			<svelte:fragment slot="lead">
				<a href="/" class="flex gap-3 justify-center">
					<img
						src="https://static.wikia.nocookie.net/thetekkit/images/3/31/Redstone.png"
						class="w-9"
						alt="Redstone Index Logo"
					/>
					<strong class="text-xl uppercase hidden md:inline self-center ">Redstone Index</strong>
				</a>
			</svelte:fragment>
			<!-- Search -->
			<div class="flex justify-center">
				<div class="input-group input-group-divide grid-cols-[auto_1fr_auto] max-w-xl">
					<div class="input-group-shi">
						<i class="fa-solid fa-magnifying-glass" />
					</div>
					<input type="search" placeholder="Search..." class="input" />
				</div>
			</div>
			<!-- Actions -->
			<svelte:fragment slot="trail">
				<button class="btn-icon hidden sm:block">
					<i class="fa-solid fa-plus" />
				</button>
				<LightSwitch width="w-[3rem] hidden sm:block" />
				{#if signedIn}
					<Avatar
						class="!ml-0 sm:!ml-5"
						src="https://i.pravatar.cc/"
						border="border-2 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer"
					/>
				{:else}
					<button class="btn">Sign In</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
