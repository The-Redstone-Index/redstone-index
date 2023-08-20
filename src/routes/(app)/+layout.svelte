<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	export let data;
	$: ({ session, supabase } = data);
	$: signedIn = !!session;

	async function signOut() {
		await supabase.auth.signOut();
		goto('/', { invalidateAll: true });
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar {signedIn} on:signOut={signOut} />
	</svelte:fragment>

	<div class="relative z-0">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
