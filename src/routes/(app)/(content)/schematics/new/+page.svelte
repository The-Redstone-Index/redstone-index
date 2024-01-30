<script lang="ts">
	import { goto } from '$app/navigation';
	import StructureSizeLimitGuard from '$lib/minecraft/StructureSizeLimitGuard.svelte';
	import StructureViewer from '$lib/minecraft/StructureViewer.svelte';
	import {
		getCroppedStructure,
		getCroppedStructureSize,
		getStructureSize
	} from '$lib/minecraft/utils.js';
	import { minecraftStore } from '$lib/stores.js';
	import {
		FileDropzone,
		RadioGroup,
		RadioItem,
		getToastStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';

	export let data;
	let { supabase, user } = data;
	$: ({ supabase, user } = data);

	const toastStore = getToastStore();
	const resources = $minecraftStore?.resources;

	let uploadMethod = 0;
	let schemaData: ArrayBuffer | null;
	let viewerClientWidth = 0; // For key block when window resized
	let loading = false;
	let isNotCroppedToDimensions = false;
	let isEmptyStructure = false;

	/*
	 * File input select (upload to browser)
	 */
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
			handleNewSchemaData(fileData);
		};
		reader.readAsArrayBuffer(file);
	}

	function handleCropStructure() {
		if (!schemaData) throw 'No schema data';
		handleNewSchemaData(getCroppedStructure(schemaData));
	}

	function handleNewSchemaData(newSchemaData: ArrayBuffer) {
		schemaData = newSchemaData;
		isNotCroppedToDimensions = false;
		isEmptyStructure = false;
		const croppedSize = getCroppedStructureSize(newSchemaData);

		// Check if structure is properly cropped to dimensions of non-air blocks
		const size = getStructureSize(newSchemaData);
		if (!(size.x === croppedSize.x && size.y === croppedSize.y && size.z === croppedSize.z)) {
			isNotCroppedToDimensions = true;
		}

		// Check if structure is empty
		if (croppedSize.x === 0 || croppedSize.y === 0 || croppedSize.z === 0) {
			isEmptyStructure = true;
		}
	}

	/*
	 * Submit file (upload to storage)
	 */
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

	const popupNotCurrentlySupported: PopupSettings = {
		event: 'hover',
		target: 'popupNotCurrentlySupported',
		placement: 'bottom',
		middleware: { offset: 10 }
	};
</script>

<svelte:head>
	<title>Upload Schematic - The Redstone Index</title>
	<meta
		name="description"
		content="Share your Minecraft redstone creation. Upload your schematic to The Redstone Index."
	/>
</svelte:head>

<div data-popup={popupNotCurrentlySupported.target}>
	<div class="opacity-50 text-xs">(Not currently supported)</div>
</div>

<div class="container mx-auto flex flex-col gap-5 p-5">
	<h1 class="my-8 h1">Upload a New Schematic</h1>

	<!-- Upload Schematic (to browser) -->
	{#if !schemaData}
		<div class="mx-auto mb-5">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={uploadMethod} name="nbt" value={0}>NBT File</RadioItem>
				<RadioItem bind:group={uploadMethod} name="world" value={1} disabled>
					<div use:popup={popupNotCurrentlySupported}>World Folder + Coords</div>
				</RadioItem>
				<RadioItem bind:group={uploadMethod} name="litematic" value={2} disabled>
					<div use:popup={popupNotCurrentlySupported}>Litematic File</div>
				</RadioItem>
			</RadioGroup>
		</div>

		<FileDropzone
			name="files"
			class="py-20 h-64 md:h-96 max-w-4xl mx-auto mb-20"
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
			<svelte:fragment slot="meta">NBT File (max size 50 MB)</svelte:fragment>
		</FileDropzone>
	{/if}

	<!-- View & Edit Schematic -->
	{#if resources && schemaData}
		<div
			class="w-full md:h-[700px] bg-surface-800 aspect-square md:aspect-auto rounded-xl"
			bind:clientWidth={viewerClientWidth}
		>
			<StructureSizeLimitGuard {schemaData} showContinue>
				{#key viewerClientWidth}
					{#key schemaData}
						<StructureViewer
							{schemaData}
							{resources}
							doElevationSlider
							doInputControls
							doBlockList
						/>
					{/key}
				{/key}
			</StructureSizeLimitGuard>
		</div>
		<div class="flex flex-col gap-5 mb-10">
			{#if isEmptyStructure}
				<blockquote class="alert variant-filled-error">
					<i class="fa-solid fa-circle-exclamation w-10 text-3xl" />
					<div class="alert-message">You cannot upload an empty schematic!</div>
				</blockquote>
			{/if}
			{#if isNotCroppedToDimensions && !isEmptyStructure}
				<blockquote class="alert variant-soft-secondary">
					<i class="fa-solid fa-circle-exclamation w-10 text-3xl" />
					<div class="alert-message">
						<p>
							Your schematic <b>is not cropped</b>
							to minimum dimensions!
						</p>
						<p>
							Would you like to <b>crop the schematic</b>
							to the dimensions of non-air blocks?
						</p>
					</div>
					<div>
						<button
							type="button"
							class="btn variant-filled-secondary"
							on:click={handleCropStructure}
						>
							Yes, Crop
						</button>
					</div>
				</blockquote>
			{/if}
		</div>
		<div class="flex justify-end gap-3 mb-10">
			<button
				type="button"
				class="btn variant-filled"
				on:click={() => (schemaData = null)}
				disabled={loading}
			>
				Clear
			</button>
			<button
				type="button"
				class="btn variant-filled-primary"
				on:click={handleUpload}
				disabled={isEmptyStructure || loading}
			>
				Upload
			</button>
		</div>
	{/if}
</div>
