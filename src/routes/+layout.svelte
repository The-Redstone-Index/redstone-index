<script lang="ts">
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import { AppShell } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '../app.postcss';
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
