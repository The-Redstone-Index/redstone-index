<script lang="ts">
	import { buildSizeOptions } from '$lib/config';
	import type { BuildSizeOption } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let sizeCategory = $modalStore[0].meta.sizeCategory as BuildSizeOption | null;

	function onSubmit() {
		$modalStore[0].response?.(sizeCategory);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function onClear() {
		sizeCategory = null;
	}
</script>

<div class="card px-10 py-6 w-modal-wide">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Build Size</header>

		<div class="flex gap-5 flex-col">
			<div class="text-center opacity-70">
				Select a size category by volume of schematic dimensions.
			</div>
			<div class="space-y-2">
				{#each Object.entries(buildSizeOptions) as [value, detail]}
					<label class="flex items-center gap-2">
						<input
							class="radio"
							type="radio"
							name="radio-direct"
							{value}
							bind:group={sizeCategory}
						/>
						<p class="font-semibold w-24">{detail.name}</p>
						<p>{detail.description}</p>
						<div class="flex-1" />
						<p class="opacity-60">{detail.example}</p>
					</label>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if sizeCategory}
				<button class="btn hover:variant-soft" on:click={onClear} type="button">Clear</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSubmit} type="button">Confirm</button>
		</div>
	</div>
</div>
