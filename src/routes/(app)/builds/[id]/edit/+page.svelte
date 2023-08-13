<script lang="ts">
	import PopupButtonMenu from '$lib/inputs/PopupButtonMenu.svelte';
	import PopupCheckboxMenu from '$lib/inputs/PopupCheckboxMenu.svelte';
	import SpecificationsTable from '$lib/SpecificationsTable.svelte';
	import { versionToInt } from '$lib/utils';
	import { fetchMinecraftVersions, type MinecraftVersions, type Version } from '$lib/versionsAPI';
	import { onMount } from 'svelte';
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

	// Schematic & Photos
	let assets = ['/piston_trapdoor.nbt'];
	let photoFiles: FileList | undefined;
	$: if (photoFiles) {
		const objectURLs = [];
		for (let i = 0; i < photoFiles.length; i++) {
			const file = photoFiles[i];
			const objectURL = URL.createObjectURL(file);
			objectURLs.push(objectURL);
		}
		assets = [assets[0], ...objectURLs];
	} else {
		assets = [assets[0]];
	}

	// Specs
	let specifications = [
		{ name: 'Items per minute', value: '124' },
		{ name: 'Input delay', value: '5 game ticks' },
		{ name: 'Automation', value: 'Semi-automatic' },
		{ name: 'Iterations per minute', value: '5' },
		{ name: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
	];

	// Tags
	let selectedTags: string[] = ['0-tick pulse'];
	const tagOptions = [
		{ value: 'wireless redstone', keywords: 'wireless redstone' },
		{ value: 'iron farm', keywords: 'iron farm' },
		{ value: '0-tick pulse', keywords: '0-tick pulse' },
		...Array.from({ length: 1000 }).map((_, i) => ({ value: `Tag ${i}`, keywords: `tag ${i}` }))
	];

	// Versions
	let worksInVersion: string | undefined;
	let breaksInVersion: string | undefined;
	let worksInVersionOptions: {
		value: string;
		keywords: string;
	}[] = [];
	let breaksInVersionOptions: {
		value: string;
		keywords: string;
	}[] = [];

	// Populate version options when API resolves
	let minecraftVersionsList: MinecraftVersions;
	$: if (minecraftVersionsList) {
		worksInVersionOptions = minecraftVersionsList.versions
			.filter((v) => v.type == 'release')
			.filter((v) => !breaksInVersion || versionToInt(v.id) < versionToInt(breaksInVersion))
			.map((v) => ({ value: v.id, keywords: v.id }));
		breaksInVersionOptions = minecraftVersionsList.versions
			.filter((v) => v.type == 'release')
			.filter((v) => !worksInVersion || versionToInt(v.id) > versionToInt(worksInVersion))
			.map((v) => ({ value: v.id, keywords: v.id }));
	}

	function onSubmit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		console.log(formData);
	}

	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as Element;
		e.key == 'Enter' && target.tagName !== 'TEXTAREA' && e.preventDefault();
	}

	onMount(async () => {
		minecraftVersionsList = await fetchMinecraftVersions();
	});
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

	<div class="label">
		Photos (optional)
		<div class="mt-2 flex gap-2">
			<input
				type="file"
				name="photos"
				class="input !outline-none w-fit"
				id="photos"
				multiple
				bind:files={photoFiles}
			/>
			{#if photoFiles}
				<button
					type="button"
					class="btn variant-soft-primary"
					on:click={() => (photoFiles = undefined)}
				>
					clear
				</button>
			{/if}
		</div>
	</div>

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
			<PopupCheckboxMenu options={tagOptions} bind:selected={selectedTags}>
				<i class="fa-solid fa-tag mr-3" />
				Edit Tags
			</PopupCheckboxMenu>
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
			{#if selectedTags.length}
				<button
					type="button"
					class="btn-icon btn-icon-sm variant-soft-surface"
					on:click={() => (selectedTags = [])}
				>
					<i class="fa-solid fa-close" />
				</button>
			{/if}
		</div>
	</div>

	<div class="label">
		Minecraft Version Compatability
		<div class="flex gap-4 items-center mb-2">
			<PopupButtonMenu options={worksInVersionOptions} bind:selected={worksInVersion}>
				<i class="fa-solid fa-circle-check mr-3" />
				Works In
			</PopupButtonMenu>
			{#if worksInVersion}
				<div class="chip variant-soft-success h-fit" in:fade={{ duration: 300 }}>
					<i class="fa-solid fa-code-commit mr-1" />
					{worksInVersion}
				</div>
				<button
					type="button"
					class="btn-icon btn-icon-sm variant-soft-surface"
					on:click={() => (worksInVersion = undefined)}
				>
					<i class="fa-solid fa-close" />
				</button>
			{/if}
		</div>
		<div class="flex gap-4 items-center">
			<PopupButtonMenu options={breaksInVersionOptions} bind:selected={breaksInVersion}>
				<i class="fa-solid fa-triangle-exclamation mr-3" />
				Breaks In
			</PopupButtonMenu>
			{#if breaksInVersion}
				<div class="chip variant-soft-error h-fit" in:fade={{ duration: 300 }}>
					<i class="fa-solid fa-code-commit mr-1" />
					{breaksInVersion}
				</div>
				<button
					type="button"
					class="btn-icon btn-icon-sm variant-soft-surface"
					on:click={() => (breaksInVersion = undefined)}
				>
					<i class="fa-solid fa-close" />
				</button>
			{/if}
		</div>
	</div>

	<div class="label">
		Specifications
		<SpecificationsTable bind:specifications editing />
	</div>

	<div class="flex gap-3 justify-end">
		<button class="btn variant-filled-primary" type="submit">Submit</button>
	</div>
</form>
