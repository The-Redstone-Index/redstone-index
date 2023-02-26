<script lang="ts">
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import { AppShell } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '../app.postcss';
	import AppBar from './AppBar.svelte';

	let signedIn = true;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar {signedIn} />
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
