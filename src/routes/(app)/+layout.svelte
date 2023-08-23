<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAvatarUrl } from '$lib/utils';
	import { AppShell, Toast } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	export let data;
	$: ({ supabase, profile } = data);

	let avatarUrl: string | undefined;
	$: if (profile) downloadAvatar();

	async function downloadAvatar() {
		if (!profile?.avatar_url) return (avatarUrl = undefined);
		avatarUrl = await getAvatarUrl(supabase, profile.avatar_url);
	}

	async function signOut() {
		await supabase.auth.signOut();
		goto('/', { invalidateAll: true });
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar {profile} {avatarUrl} on:signOut={signOut} />
	</svelte:fragment>

	<div class="relative z-0">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>

<Toast />
