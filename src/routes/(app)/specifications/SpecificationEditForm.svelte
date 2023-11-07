<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';

	export let name: string;
	export let description: string;
	export let keywords: string;
	export let unit: string;

	const unitTypes = [
		'None',
		'Items per minute',
		'Blocks per minute',
		'Iterations per minute',
		'Game ticks',
		'Other (specify)'
	] as const;
	let unitType: (typeof unitTypes)[number] = unit
		? unitTypes.find((v) => v === unit) ?? 'Other (specify)'
		: 'None';
</script>

<form on:submit|preventDefault class="flex flex-col gap-5">
	<label>
		<div class="ml-3">
			Name <span class="opacity-40 ml-5">* required</span>
		</div>
		<input
			type="text"
			bind:value={name}
			required
			maxlength="80"
			minlength="3"
			class="input"
			placeholder="e.g. Melons produced"
		/>
	</label>
	<div>
		<div class="ml-3">Description</div>
		<AutoResizeTextarea
			bind:value={description}
			maxlength={1000}
			placeholder="e.g. Number of melons produced in one minute."
		/>
	</div>
	<label>
		<div class="ml-3">Keywords</div>
		<input
			type="text"
			bind:value={keywords}
			maxlength="200"
			class="input"
			placeholder="e.g. yield, melon, fruit, food, produced"
		/>
	</label>
	<label>
		<div class="ml-3">Unit</div>
		<div class="flex flex-col md:flex-row gap-2">
			<select
				class="select md:!w-96"
				bind:value={unitType}
				placeholder="Select unit..."
				on:change={() => {
					if (unitType === 'Other (specify)' || unitType === 'None') unit = '';
					else unit = unitType ?? '';
				}}
			>
				{#each unitTypes as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
			<input
				type="text"
				bind:value={unit}
				name="unit"
				maxlength="30"
				required={unitType === 'Other (specify)'}
				class="input flex-1"
				placeholder="e.g. Melons per minute"
				class:hidden={unitType !== 'Other (specify)'}
			/>
		</div>
	</label>
	<div class="flex justify-end">
		<button class="btn variant-filled-primary">Submit</button>
	</div>
</form>
