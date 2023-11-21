<script lang="ts">
	import type { SpecRequirement } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let specReqs = $modalStore[0].meta.specReqs as SpecRequirement[] | null;

	function onSelect() {
		$modalStore[0].response?.(['2_gt_3', '3_lt_21']);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Specifications</header>

		<div>Search Specifications...</div>
		<div>Set requirements...</div>
		{specReqs}

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSelect} type="button">Confirm</button>
		</div>
	</div>
</div>
