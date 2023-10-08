<script lang="ts">
	import { goto } from '$app/navigation';
	import StructureViewer from '$lib/minecraft-rendering/StructureViewer.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
	import { FileDropzone, RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let data;
	let { supabase, user } = data;
	$: ({ supabase, user } = data);

	const toastStore = getToastStore();

	let uploadMethod = 0;
	let schemaData: ArrayBuffer | null;
	let resources: Resources;
	let viewerClientWidth = 0; // For key block when window resized
	let loading = false;

	function handleFileSelect(event: Event) {
		const fileList = (event.target as HTMLInputElement).files;
		if (!fileList || fileList.length === 0) {
			return (schemaData = null);
		}
		const file = fileList[0] as File;

		// Read the file content
		const reader = new FileReader();
		reader.onload = (event: ProgressEvent<FileReader>) => {
			const fileData = event.target?.result as ArrayBuffer;
			schemaData = fileData;
		};
		reader.readAsArrayBuffer(file);
	}

	onMount(async () => {
		resources = await getResources();
	});

	async function handleUpload() {
		loading = true;
		try {
			const uuid = crypto.randomUUID();
			const path = `${user?.id}/${uuid}.nbt`;
			if (!schemaData) throw Error('Schematic data not found');
			const { error } = await supabase.storage.from('schematics').upload(path, schemaData);
			if (error) throw Error(error.message);
			toastStore.trigger({
				message: 'Schematic has been uploaded!',
				background: 'variant-filled-success',
				classes: 'pl-8'
			});
			goto(`/users/${user?.numeric_id}#schematics`);
		} catch (error: any) {
			console.error(error);
			toastStore.trigger({
				message: 'Sorry, there was a problem uploading.',
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Upload Schematic - The Redstone Index</title>
	<meta
		name="description"
		content="Share your Minecraft redstone creation. Upload your schematic to The Redstone Index."
	/>
</svelte:head>

<div class="container mx-auto flex flex-col gap-5 p-5">
	<h1 class="my-8 h1">Upload a New Schematic</h1>

	{#if !schemaData}
		<div class="mx-auto mb-5">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={uploadMethod} name="nbt" value={0}>NBT File</RadioItem>
				<RadioItem bind:group={uploadMethod} name="world" value={1} disabled>
					World Folder + Coords
				</RadioItem>
				<RadioItem bind:group={uploadMethod} name="litematic" value={2} disabled>
					Litematic File
				</RadioItem>
			</RadioGroup>
		</div>

		<FileDropzone
			name="files"
			class="py-20 h-64 md:h-96 max-w-4xl mx-auto"
			on:change={handleFileSelect}
			accept=".nbt"
		>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-cube text-5xl" />
			</svelte:fragment>
			<svelte:fragment slot="message">
				<b>Upload a file</b>
				or drag and drop
			</svelte:fragment>
			<svelte:fragment slot="meta">NBT File (max size ? GB)</svelte:fragment>
		</FileDropzone>
	{:else}
		<div
			class="w-full md:h-[700px] bg-surface-800 aspect-square md:aspect-auto rounded-xl"
			bind:clientWidth={viewerClientWidth}
		>
			{#key viewerClientWidth}
				<StructureViewer {schemaData} {resources} doElevationSlider doInputControls doBlockList />
			{/key}
		</div>
	{/if}

	{#if schemaData}
		<div class="flex justify-end gap-3">
			<button type="button" class="btn variant-filled" on:click={() => (schemaData = null)}>
				Clear
			</button>
			<button type="button" class="btn variant-filled-primary" on:click={handleUpload}>
				Upload
			</button>
		</div>
	{/if}
</div>
