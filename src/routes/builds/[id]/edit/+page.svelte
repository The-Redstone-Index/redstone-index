<script lang="ts">
	import AssetViewerSection from '$lib/AssetViewerSection.svelte';
	import SpecificationsTable from '$lib/SpecificationsTable.svelte';
	import { InputChip } from '@skeletonlabs/skeleton';

	let title = '';
	let description = '';
	let descriptionTextAreaEl: HTMLTextAreaElement;
	$: if (description && descriptionTextAreaEl) {
		console.log('???');
		descriptionTextAreaEl.style.height = '';
		descriptionTextAreaEl.style.height = descriptionTextAreaEl.scrollHeight + 2 + 'px';
	}

	let assets = [
		'/piston_trapdoor.nbt',
		...[...Array(5)].map(() => `https://picsum.photos/300/200?i=${Math.random()}`)
	];

	let specifications = [
		{ name: 'Items per minute', value: '124' },
		{ name: 'Input delay', value: '5 game ticks' },
		{ name: 'Automation', value: 'Semi-automatic' },
		{ name: 'Iterations per minute', value: '5' },
		{ name: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
	];

	function onSubmit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		console.log(formData);
	}
</script>

<form
	class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl"
	on:submit|preventDefault={onSubmit}
>
	<label class="label">
		Build Title
		<input
			type="text"
			class="input text-4xl font-bold"
			id="build-title"
			bind:value={title}
			name="name"
			required
			placeholder="My Redstone Build..."
		/>
	</label>

	<div class="label">
		Preview
		<AssetViewerSection {assets} />
	</div>

	<label for="photos">
		Photos (optional)
		<div>
			<input type="file" name="photos" id="photos" multiple />
		</div>
	</label>

	<label class="label">
		Description
		<textarea
			class="textarea resize-none"
			rows="3"
			placeholder="Description..."
			bind:this={descriptionTextAreaEl}
			name="description"
			bind:value={description}
		/>
	</label>

	<label class="label" for="tags">
		Tags
		<InputChip id="tags" value={['wireless redstone', 'iron farm', '0-tick pulse']} name="tags" />
		<!-- TODO: autocomplete popup menu -->
	</label>

	<label class="label" for="tags">
		Minecraft Version Compatability
		<InputChip id="tags" value={['1.16+', '1.17+', 'Breaks 1.19+']} name="tags" />
		<!-- TODO: autocomplete popup menu -->
	</label>

	<div class="label">
		Specifications
		<SpecificationsTable bind:specifications editing />
	</div>

	<div class="flex gap-3 justify-end">
		<button class="btn variant-filled-primary" type="submit">Submit</button>
	</div>
</form>
