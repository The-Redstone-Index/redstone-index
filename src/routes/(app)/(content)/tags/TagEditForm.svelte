<script lang="ts">
	import InputLengthIndicator from '$lib/InputLengthIndicator.svelte';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';

	export let name: string;
	export let description: string;
	export let keywords: string;
	export let parentId: number | null;
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
			placeholder="e.g. Piston Trapdoor"
		/>
		<InputLengthIndicator text={name} minLength={3} maxLength={80} />
	</label>
	<div>
		<div class="ml-3">Description</div>
		<AutoResizeTextarea
			bind:value={description}
			maxlength={1000}
			placeholder="e.g. Uses pistons to create an opening in the floor."
		/>
		<InputLengthIndicator text={name} maxLength={1000} />
	</div>
	<label>
		<div class="ml-3">Keywords</div>
		<input
			type="text"
			bind:value={keywords}
			maxlength="200"
			class="input"
			placeholder="e.g. door, piston, trapdoor, floor, entrance"
		/>
		<InputLengthIndicator text={name} maxLength={200} />
	</label>
	<label>
		<div class="ml-3">Parent Tag ID</div>
		<input
			type="number"
			pattern="\d*"
			bind:value={parentId}
			list="asd"
			class="input"
			placeholder="e.g. 1"
		/>
	</label>
	<div class="flex justify-end">
		<button class="btn variant-filled-primary">Submit</button>
	</div>
</form>
