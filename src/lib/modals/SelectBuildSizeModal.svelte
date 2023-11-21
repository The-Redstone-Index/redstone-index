<script lang="ts">
	import type { SchematicSize } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let sizeCategory = $modalStore[0].meta.sizeCategory as SchematicSize | null;

	function onSelect() {
		$modalStore[0].response?.('medium');
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Build Size</header>

		<div>Set size option...</div>
		{sizeCategory}

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
