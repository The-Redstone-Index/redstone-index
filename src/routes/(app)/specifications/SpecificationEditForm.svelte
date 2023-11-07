<script lang="ts">
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';

	export let name: string;
	export let description: string;
	export let keywords: string;
	export let unit: string;
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
			placeholder="e.g. Melons per minute"
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
		<input
			type="text"
			bind:value={unit}
			required
			maxlength="30"
			class="input"
			placeholder="e.g. Melons/minute"
		/>
	</label>
	<div class="flex justify-end">
		<button class="btn variant-filled-primary">Submit</button>
	</div>
</form>
