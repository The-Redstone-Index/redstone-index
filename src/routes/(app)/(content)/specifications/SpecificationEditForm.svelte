<script lang="ts">
	import InputLengthIndicator from '$lib/InputLengthIndicator.svelte';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';

	export let name: string;
	export let description: string;
	export let keywords: string;
	export let unit: string | null;

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
		<InputLengthIndicator text={name} minLength={3} maxLength={80} />
	</label>
	<div>
		<div class="ml-3">Description</div>
		<AutoResizeTextarea
			bind:value={description}
			maxlength={1000}
			placeholder="e.g. Number of melons produced in one minute."
		/>
		<InputLengthIndicator text={description} maxLength={1000} />
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
		<InputLengthIndicator text={keywords} maxLength={200} />
	</label>
	<label>
		<div class="ml-3">Unit</div>
		<div class="flex flex-col md:flex-row gap-2 items-start">
			<select
				class="select md:!w-96"
				bind:value={unitType}
				placeholder="Select unit..."
				on:change={() => {
					if (unitType === 'Other (specify)') unit = '';
					else if (unitType === 'None') unit = null;
					else unit = unitType ?? '';
				}}
			>
				{#each unitTypes as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
			<div class="flex-1" class:hidden={unitType !== 'Other (specify)'}>
				<input
					type="text"
					bind:value={unit}
					name="unit"
					maxlength="30"
					required={unitType === 'Other (specify)'}
					class="input"
					placeholder="e.g. Melons per minute"
				/>
				{#if unit}
					<InputLengthIndicator text={unit} minLength={1} maxLength={30} />
				{/if}
			</div>
		</div>
	</label>
	<div class="flex justify-end">
		<button class="btn variant-filled-primary">Submit</button>
	</div>
</form>
