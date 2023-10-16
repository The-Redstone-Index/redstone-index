<script lang="ts">
	import PopupButtonMenu from '$lib/inputs/PopupButtonMenu.svelte';
	import PopupCheckboxMenu from '$lib/inputs/PopupCheckboxMenu.svelte';
	import { getVersions, type Version } from '$lib/minecraft-rendering/mcmetaAPI';
	import SpecificationsTable from '$lib/SpecificationsTable.svelte';
	import { versionIntToString, versionStringToInt } from '$lib/utils';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import AssetViewerSection from '../AssetViewerSection.svelte';

	export let data;

	let { supabase, build, schematic } = data;
	$: ({ supabase, build, schematic } = data);

	// Title
	let title = build?.title ?? '';

	// Description
	let description = build?.description ?? '';
	let descriptionTextAreaEl: HTMLTextAreaElement;
	$: if (description && descriptionTextAreaEl) {
		descriptionTextAreaEl.style.height = '';
		descriptionTextAreaEl.style.height = descriptionTextAreaEl.scrollHeight + 2 + 'px';
	}

	// Schematic & Photos
	let assets = [schematic.object_path];
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

	/*
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
	*/

	// Versions
	let worksInVersion: number | undefined = build?.works_in_version_int;
	let breaksInVersion: number | undefined = build?.breaks_in_version_int;
	let worksInVersionOptions: { name: string; value: number; keywords: string }[] = [];
	let breaksInVersionOptions: { name: string; value: number; keywords: string }[] = [];

	// Populate version options when API resolves
	let minecraftVersionsList: Version[];
	$: if (minecraftVersionsList) {
		const versionOptions = [
			...minecraftVersionsList
				.filter((v) => v.type == 'release')
				.map((v) => ({ name: v.id, value: versionStringToInt(v.id), keywords: v.id }))
		];
		worksInVersionOptions = versionOptions.filter(
			(v) => !breaksInVersion || v.value < breaksInVersion
		);
		breaksInVersionOptions = versionOptions.filter(
			(v) => !worksInVersion || v.value > worksInVersion
		);
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
		minecraftVersionsList = await getVersions();
	});
</script>

<svelte:head>
	<title>Edit - {title.trim() || 'No Title'} - The Redstone Index</title>
	<meta
		name="description"
		content="Edit and update your Minecraft redstone build - {title} - on The Redstone Index."
	/>
</svelte:head>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form
	class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl"
	on:keydown={handleKeydown}
	on:submit|preventDefault={onSubmit}
>
	<label class="label">
		<span>Build Title*</span>
		<input
			type="text"
			class="input text-4xl font-bold"
			id="build-title"
			bind:value={title}
			name="name"
			required
			placeholder="Enter title here..."
		/>
	</label>

	<div class="label">
		<span>Preview</span>
		<AssetViewerSection {supabase} {assets} />
	</div>

	<div class="label">
		Photos <span class="ml-1 opacity-40">(optional)</span>
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
		<span>Description</span>
		<textarea
			class="textarea resize-none"
			rows="8"
			placeholder="Enter description here..."
			bind:this={descriptionTextAreaEl}
			name="description"
			bind:value={description}
		/>
	</label>

	<!--
	<div class="label">
		<span>Tags</span>
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
				{:else}
					<div class="opacity-50">None Selected</div>
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
	 -->
	<div class="label">
		<span>Minecraft Version Compatability</span>
		<div class="flex flex-col md:flex-row">
			<div class="flex gap-4 items-center mb-2 flex-1">
				<PopupButtonMenu options={worksInVersionOptions} bind:selected={worksInVersion}>
					<i class="fa-solid fa-circle-check mr-3" />
					Works In
				</PopupButtonMenu>
				{#if worksInVersion}
					<div class="chip variant-filled-success h-fit" in:fade={{ duration: 300 }}>
						<i class="fa-solid fa-check mr-1" />
						{versionIntToString(worksInVersion)}+
					</div>
					<button
						type="button"
						class="btn-icon btn-icon-sm variant-soft-surface"
						on:click={() => (worksInVersion = undefined)}
					>
						<i class="fa-solid fa-close" />
					</button>
				{:else}
					<div class="opacity-50">*Required</div>
				{/if}
			</div>
			<div class="flex gap-4 items-center flex-1">
				<PopupButtonMenu options={breaksInVersionOptions} bind:selected={breaksInVersion}>
					<i class="fa-solid fa-triangle-exclamation mr-3" />
					Breaks In
				</PopupButtonMenu>
				{#if breaksInVersion}
					<div class="chip variant-filled-error h-fit" in:fade={{ duration: 300 }}>
						<i class="fa-solid fa-close mr-1" />
						{versionIntToString(breaksInVersion)}+
					</div>
					<button
						type="button"
						class="btn-icon btn-icon-sm variant-soft-surface"
						on:click={() => (breaksInVersion = undefined)}
					>
						<i class="fa-solid fa-close" />
					</button>
				{:else}
					<div class="opacity-50">Not Specified</div>
				{/if}
			</div>
		</div>
	</div>

	<!--
		<div class="label">
			<span>Specifications</span>
			<SpecificationsTable bind:specifications editing />
		</div>
	-->

	<div class="flex gap-3 justify-end">
		<button class="btn variant-filled-primary" type="submit">Submit</button>
	</div>
</form>
