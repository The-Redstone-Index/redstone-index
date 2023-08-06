<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	let signedIn = true;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar {signedIn} />
	</svelte:fragment>

	<div class="relative z-0">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
