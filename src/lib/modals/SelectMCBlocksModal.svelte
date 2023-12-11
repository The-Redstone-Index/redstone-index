<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let blocksIncluded = $modalStore[0].meta.blocksIncluded as string[] | null;

	function onSelect() {
		$modalStore[0].response?.(['minecraft:lever', 'minecraft:redstone_wire']);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Blocks Required</header>

		<div>Search Blocks...</div>
		{blocksIncluded}

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
