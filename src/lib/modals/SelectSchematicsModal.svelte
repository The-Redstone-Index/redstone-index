<script lang="ts">
	import SchematicCard from '$lib/cards/SchematicCard.svelte';
	import SchematicChip from '$lib/chips/SchematicChip.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const supabase = $supabaseStore;

	let selectedSchematics = ($modalStore[0].meta.schematics as Tables<'schematics'>[] | null) ?? [];
	$: selectedSchematicIds = selectedSchematics.map((s) => s.id);

	let query = supabase.from('schematics').select('*').order('created_at', { ascending: false });

	function onSubmit() {
		$modalStore[0].response?.(selectedSchematics);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function handleClickSchematic(clickedSchematic: Tables<'schematics'>) {
		if (selectedSchematicIds.includes(clickedSchematic.id)) {
			selectedSchematics = selectedSchematics.filter((s) => s.id !== clickedSchematic.id);
		} else {
			selectedSchematics = [...selectedSchematics, clickedSchematic];
		}
	}
</script>

<div class="card px-10 py-6 w-modal-wide">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select User</header>

		<div class="flex flex-col gap-3 !h-[60vh] overflow-y-auto">
			<!-- Schematic list -->
			{#await query}
				<LoadingSpinnerArea />
			{:then { data, error }}
				<div class="flex flex-wrap gap-3 justify-center">
					{#if data}
						{#each data as schematic}
							{@const selected = selectedSchematicIds?.includes(schematic.id)}
							<SchematicCard {schematic} on:click={() => handleClickSchematic(schematic)}>
								{#if selected}
									<i class="fas fa-check absolute top-3 left-3 text-success-500" />
								{/if}
							</SchematicCard>
						{:else}
							<div class="h-60 grid place-items-center opacity-50 font-semibold">No Users</div>
						{/each}
					{/if}
					{#if error}
						{error.message}
					{/if}
				</div>
			{/await}
		</div>

		<!-- Selected -->
		<hr />
		<div class="overflow-y-auto">
			<div class="mb-1 flex gap-3">
				<span class="mr-3">Selected schematics:</span>
				{#each selectedSchematics as schematic}
					<SchematicChip
						schematicId={schematic.id}
						showLink
						showDelete
						on:delete={() => handleClickSchematic(schematic)}
					/>
				{:else}
					<span class="opacity-50">None Selected</span>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-3">
			{#if selectedSchematicIds.length}
				<button
					class="btn hover:variant-soft"
					on:click={() => (selectedSchematicIds = [])}
					type="button"
				>
					Clear
				</button>
			{/if}
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button class="btn variant-filled-primary" on:click={onSubmit} type="button">Confirm</button>
		</div>
	</div>
</div>
