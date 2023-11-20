<script lang="ts">
	import { goto } from '$app/navigation';
	import SelectMinecraftFaceModal from '$lib/modals/SelectMinecraftFaceModal.svelte';
	import { AppShell, Modal, Toast, type ModalComponent } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	export let data;
	let { supabase, user } = data;
	$: ({ supabase, user } = data);

	async function signOut() {
		const x = await supabase.auth.signOut();
		console.log(x);
		setTimeout(() => goto('/', { invalidateAll: true }), 1000);
	}

	const modalRegistry: Record<string, ModalComponent> = {
		selectMinecraftFaceModal: { ref: SelectMinecraftFaceModal }
	};

	SelectMinecraftFaceModal;
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

<Modal components={modalRegistry} />
