<script lang="ts">
	import { minecraftStore } from '$lib/stores';
	import { SlideToggle, getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let mcVersion = $modalStore[0].meta.mcVersion as number | null;
	let note = $modalStore[0].meta.note as string | undefined;

	let showSnapshots = false;

	function onSubmit() {
		$modalStore[0].response?.(mcVersion);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function onClear() {
		mcVersion = null;
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Minecraft Version</header>

		<div class="flex flex-col gap-5">
			<!-- Snapshots toggle -->
			<div class="flex ml-">
				<SlideToggle
					name="Snapshots"
					bind:checked={showSnapshots}
					size="sm"
					active="bg-primary-500"
				>
					Show Snapshots
				</SlideToggle>
			</div>

			<!-- Select input -->
			<select name="minecraft_version" class="select" bind:value={mcVersion}>
				<option value={null} disabled selected>Select Minecraft Version</option>
				{#if $minecraftStore}
					{#each $minecraftStore?.versionList.filter((v) => showSnapshots || v.type === 'release') as version}
						<option value={version.data_version}>
							{version.name}
						</option>
					{/each}
				{/if}
			</select>

			<!-- Note -->
			{#if note}
				<div class="text-center opacity-60" style="text-wrap: pretty;">{note}</div>
			{/if}
		</div>

		<div class="flex justify-end gap-3">
			{#if mcVersion}
				<button class="btn hover:variant-soft" on:click={onClear} type="button">Clear</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSubmit} type="button">Confirm</button>
		</div>
	</div>
</div>
