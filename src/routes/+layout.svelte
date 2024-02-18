<script lang="ts">
	import { afterNavigate, invalidate } from '$app/navigation';
	import { supabaseStore } from '$lib/stores';
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import '../app.postcss';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	// Init Skeleton stores (modals & toasts)
	initializeStores();

	// Init Supabase store
	supabaseStore.set(supabase);

	// Always scroll to top when navigating to a new page
	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	// Invalidate session related data when auth state changes
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
