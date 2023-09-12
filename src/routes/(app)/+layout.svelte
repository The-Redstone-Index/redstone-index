<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	export let data;
	$: ({ supabase, user } = data);

	async function signOut() {
		await supabase.auth.signOut();
		goto('/', { invalidateAll: true });
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar {user} {supabase} on:signOut={signOut} />
	</svelte:fragment>

	<div class="relative z-0">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>

<Toast />

<Modal />
