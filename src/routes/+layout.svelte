<script lang="ts">
	import { invalidate } from '$app/navigation';
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import { onMount } from 'svelte';
	import '../app.postcss';

	export let data;
	let { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
