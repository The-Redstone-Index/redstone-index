<script lang="ts">
	import type { SortingOption } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let sortBy = $modalStore[0].meta.sortBy as SortingOption | null;

	function onSelect() {
		$modalStore[0].response?.('Newest');
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Sort By</header>

		<div>Sort options...</div>
		{sortBy}

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
