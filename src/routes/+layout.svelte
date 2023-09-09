<script lang="ts">
	import { invalidate } from '$app/navigation';
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import '../app.postcss';

	export let data;
	$: ({ supabase, session } = data);

	initializeStores();

	onMount(() => {
		// Invalidate session related data when auth state changes
		const { data } = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
