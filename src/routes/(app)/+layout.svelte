<script lang="ts">
	import { goto } from '$app/navigation';
	import SelectBuildSizeModal from '$lib/modals/SelectBuildSizeModal.svelte';
	import SelectMcBlocksModal from '$lib/modals/SelectMCBlocksModal.svelte';
	import SelectMcVersionModal from '$lib/modals/SelectMCVersionModal.svelte';
	import SelectMinecraftFaceModal from '$lib/modals/SelectMinecraftFaceModal.svelte';
	import SelectSchematicsModal from '$lib/modals/SelectSchematicsModal.svelte';
	import SelectSortByModal from '$lib/modals/SelectSortByModal.svelte';
	import SelectSpecReqsModal from '$lib/modals/SelectSpecReqsModal.svelte';
	import SelectSpecsModal from '$lib/modals/SelectSpecsModal.svelte';
	import SelectTagsModal from '$lib/modals/SelectTagsModal.svelte';
	import SelectUserModal from '$lib/modals/SelectUserModal.svelte';
	import { AppShell, Modal, Toast, type ModalComponent } from '@skeletonlabs/skeleton';
	import AppBar from './AppBar.svelte';
	import Footer from './Footer.svelte';

	export let data;
	let { supabase, user } = data;
	$: ({ supabase, user } = data);

	async function signOut() {
		await supabase.auth.signOut();
		goto('/', { invalidateAll: true });
	}

	const modalRegistry: Record<string, ModalComponent> = {
		selectMinecraftFaceModal: { ref: SelectMinecraftFaceModal },
		selectTagsModal: { ref: SelectTagsModal },
		selectBuildSizeModal: { ref: SelectBuildSizeModal },
		selectMcBlocksModal: { ref: SelectMcBlocksModal },
		selectMcVersionModal: { ref: SelectMcVersionModal },
		selectSortByModal: { ref: SelectSortByModal },
		selectSpecReqsModal: { ref: SelectSpecReqsModal },
		selectUserModal: { ref: SelectUserModal },
		selectSchematicsModal: { ref: SelectSchematicsModal },
		selectSpecsModal: { ref: SelectSpecsModal }
	};
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
