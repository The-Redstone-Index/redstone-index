<script lang="ts">
	import CheckboxSearchInput from '$lib/CheckboxMenuInput.svelte';
	import SpecificationsTable from '$lib/SpecificationsTable.svelte';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import AssetViewerSection from '../AssetViewerSection.svelte';

	let title = '';
	let description = '';
	let descriptionTextAreaEl: HTMLTextAreaElement;
	$: if (description && descriptionTextAreaEl) {
		descriptionTextAreaEl.style.height = '';
		descriptionTextAreaEl.style.height = descriptionTextAreaEl.scrollHeight + 2 + 'px';
	}

	let assets = ['/piston_trapdoor.nbt'];

	let photoFiles: FileList;

	$: if (photoFiles) {
		const objectURLs = [];
		for (let i = 0; i < photoFiles.length; i++) {
			const file = photoFiles[i];
			const objectURL = URL.createObjectURL(file);
			objectURLs.push(objectURL);
		}
		assets = [assets[0], ...objectURLs];
	}

	let specifications = [
		{ name: 'Items per minute', value: '124' },
		{ name: 'Input delay', value: '5 game ticks' },
		{ name: 'Automation', value: 'Semi-automatic' },
		{ name: 'Iterations per minute', value: '5' },
		{ name: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
	];

	let selectedTags: string[] = ['0-tick pulse'];
	const tagOptions = [
		{ value: 'wireless redstone', keywords: 'wireless redstone' },
		{ value: 'iron farm', keywords: 'iron farm' },
		{ value: '0-tick pulse', keywords: '0-tick pulse' },
		...Array.from({ length: 1000 }).map((_, i) => ({ value: `Tag ${i}`, keywords: `tag ${i}` }))
	];

	function onSubmit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		console.log(formData);
	}

	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as Element;
		e.key == 'Enter' && target.tagName !== 'TEXTAREA' && e.preventDefault();
	}
</script>

<form
	class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl"
	on:keydown={handleKeydown}
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
			<input type="file" name="photos" id="photos" multiple bind:files={photoFiles} />
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

	<div class="label">
		Tags
		<div class="flex gap-4 items-center">
			<CheckboxSearchInput options={tagOptions} bind:selected={selectedTags}>
				<i class="fa-solid fa-tag mr-3" />
				Edit Tags
			</CheckboxSearchInput>
			<div class="flex gap-2 flex-wrap">
				{#each selectedTags as tag (tag)}
					<div
						class="chip variant-soft-primary h-fit"
						in:fade={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
					>
						<i class="fa-solid fa-hashtag mr-2" />
						{tag}
					</div>
				{/each}
			</div>
		</div>
	</div>

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
