<script lang="ts">
	import { goto } from '$app/navigation';
	import { getImageUrl } from '$lib/api';
	import PopupButtonMenu from '$lib/inputs/PopupButtonMenu.svelte';
	import { getVersions, type Version } from '$lib/minecraft-rendering/mcmetaAPI';
	import { versionIntToString, versionStringToInt } from '$lib/utils';
	import { FileButton, getModalStore, getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import prettyBytes from 'pretty-bytes';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import AssetViewerSection from '../AssetViewerSection.svelte';

	export let data;

	let { supabase, build, schematic, buildId, user } = data;
	$: ({ supabase, build, schematic, buildId, user } = data);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// Title
	let title = build?.title ?? '';
	const titleMaxLength = 80;

	// Description
	let description = build?.description ?? '';
	let descriptionTextAreaEl: HTMLTextAreaElement;
	$: if (description && descriptionTextAreaEl) {
		descriptionTextAreaEl.style.height = '';
		descriptionTextAreaEl.style.height = descriptionTextAreaEl.scrollHeight + 2 + 'px';
	}
	const descriptionMaxLength = 5000;

	// Images
	type UploadStatus = 'pending' | 'success' | 'error';
	type ImageItem = { path: string; file: File; status: UploadStatus };
	let newImageFiles: FileList | undefined;
	let imageFiles: ImageItem[] = [];
	$: if (newImageFiles) handleNewImages(newImageFiles);

	const debouncedRefreshImageFiles = debounce(() => (imageFiles = imageFiles), 500);

	function handleNewImages(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.substring(file.name.lastIndexOf('.'));
			const path = `${user.id}/${crypto.randomUUID()}${extension}`;
			let imageItem = { path, file, status: 'pending' as UploadStatus };
			imageFiles.push(imageItem);
			supabase.storage
				.from('images')
				.upload(path, file)
				.then(({ error }) => {
					if (error) imageItem.status = 'error';
					else imageItem.status = 'success';
					debouncedRefreshImageFiles();
				});
		}
		imageFiles = imageFiles;
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
	let worksInVersion: number | undefined = build?.works_in_version_int || undefined;
	let breaksInVersion: number | undefined = build?.breaks_in_version_int || undefined;
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

	async function handleSubmit() {
		if (build) {
			const { error } = await supabase
				.from('builds')
				.update({
					title,
					description,
					works_in_version_int: worksInVersion,
					breaks_in_version_int: breaksInVersion,
					extra_images: imageFiles.map((v) => v.path)
				})
				.eq('id', buildId);
			if (error) {
				toastStore.trigger({
					message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
					background: 'variant-filled-error',
					classes: 'pl-8'
				});
			} else {
				toastStore.trigger({
					message: `<i class="fas fa-check mr-1"></i> Updated Build!`,
					background: 'variant-filled-success',
					classes: 'pl-8'
				});
				goto(`/builds/${buildId}`);
			}
		} else {
			if (!title) throw 'Error: title does not exist?!';
			const userId = user.id.toString();
			const { error } = await supabase.from('builds').insert({
				id: buildId,
				user_id: userId,
				title: title,
				description,
				works_in_version_int: worksInVersion,
				breaks_in_version_int: breaksInVersion,
				extra_images: imageFiles.map((v) => v.path)
			});
			if (error) {
				toastStore.trigger({
					message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
					background: 'variant-filled-error',
					classes: 'pl-8'
				});
			} else {
				toastStore.trigger({
					message: `<i class="fas fa-check mr-1"></i> Published Build!`,
					background: 'variant-filled-success',
					classes: 'pl-8'
				});
				goto(`/builds/${buildId}`);
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as Element;
		e.key == 'Enter' && target.tagName !== 'TEXTAREA' && e.preventDefault();
	}

	onMount(async () => {
		minecraftVersionsList = await getVersions();
	});

	function confirmCancel() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Discard Changes',
			body: 'Any changes you have made will be lost.',
			response: async (r: boolean) => {
				if (r) goto('.');
			}
		});
	}

	function confirmSubmit() {
		modalStore.trigger({
			type: 'confirm',
			title: build ? 'Update Build' : 'Publish Build',
			body: build
				? 'Your build will be updated with new information.'
				: 'Your build will be submitted to the index and will be publicly viewable.',
			response: async (r: boolean) => {
				if (r) handleSubmit();
			}
		});
	}
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
	class="container mx-auto mb-10 p-3 pt-12 max-w-7xl"
	on:keydown={handleKeydown}
	on:submit|preventDefault={confirmSubmit}
>
	<h1
		class="font-bold leading-none tracking-tight text-gray-900 dark:text-white h2 mb-10"
		class:opacity-40={!title}
	>
		{#if title}{title}{:else}No title...{/if}
	</h1>

	<label class="label mb-5">
		<div class="px-3">Build Title*</div>
		<input
			type="text"
			class="input"
			id="build-title"
			bind:value={title}
			name="name"
			required
			placeholder="Enter title here..."
			maxlength={titleMaxLength}
		/>
		<div
			class="px-5 text-end opacity-50 text-sm transition-opacity"
			class:opacity-100={title.length >= titleMaxLength}
		>
			{title.length} / {titleMaxLength} characters
		</div>
	</label>

	<div class="label mb-10">
		<div class="px-3">Preview</div>
		{#key imageFiles}
			<AssetViewerSection
				{supabase}
				schematicPath={schematic.object_path}
				extraImagePaths={imageFiles.map((v) => v.path)}
				extraSchematicPaths={[
					'c7a11191-7ef9-43dc-8c21-a07aeadf13db/8fd30bc6-ecde-4ac4-b2ca-fa6764d42a07.nbt'
				]}
			/>
		{/key}
	</div>

	<!-- Images -->
	<div class="label mb-10">
		<div class="px-3">
			Images <span class="ml-1 opacity-40">(optional)</span>
		</div>
		<!-- Upload button -->
		<div class="mt-2 flex gap-2">
			<FileButton name="images" multiple bind:files={newImageFiles}>Select Images</FileButton>
		</div>
		<!-- Image list + status -->
		<div class="grid grid-cols-4 ml-5 pt-3">
			{#each imageFiles as item, i}
				<div>
					{#if item.status === 'success'}
						<a class="anchor" href={getImageUrl(supabase, item.path)} target="_blank">
							Image #{i + 1}
						</a>
					{:else}
						Image #{i + 1}
					{/if}
				</div>
				<div>
					{prettyBytes(item.file.size)}
				</div>
				<div class="w-96 h-5 flex items-center">
					{#if item.status === 'error'}
						<div class="text-error-700">
							<i class="fa-solid fa-triangle-exclamation mr-2" />
							Error uploading image
						</div>
					{:else if item.status === 'pending'}
						<ProgressRadial width="w-5" stroke={100} />
					{:else}
						<i class="fas fa-check mr-2 text-success-800" />
					{/if}
				</div>
				<button
					class="btn-icon btn-icon-sm variant-soft-surface hover:variant-soft-error"
					type="button"
					on:click={() => {
						imageFiles.splice(i, 1);
						imageFiles = imageFiles;
					}}
				>
					<i class="fa-regular fa-trash-can" />
				</button>
			{/each}
		</div>
	</div>

	<!-- Description -->
	<label class="label mb-5">
		<div class="px-3">Description</div>
		<textarea
			class="textarea resize-none"
			rows="8"
			placeholder="Enter description here..."
			bind:this={descriptionTextAreaEl}
			name="description"
			bind:value={description}
			maxlength={descriptionMaxLength}
		/>
		<div
			class="px-5 text-end opacity-50 text-sm transition-opacity"
			class:opacity-100={description.length >= descriptionMaxLength}
		>
			{description.length} / {descriptionMaxLength} characters
		</div>
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
	<div class="label mb-10">
		<div class="px-3 mb-3">Minecraft Version Compatability</div>
		<div class="flex flex-col md:flex-row">
			<div class="flex gap-4 items-center mb-2 flex-1 relative">
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
					<div class="opacity-50">Not Specified</div>
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
		<button class="btn variant-filled-surface" type="button" on:click={confirmCancel}>
			Cancel
		</button>
		<button class="btn variant-filled-primary" type="submit">
			<i class="mr-3 fa-solid fa-check" />
			{#if !build}
				Publish
			{:else}
				Update
			{/if}
		</button>
	</div>
</form>
