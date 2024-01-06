<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import InputLengthIndicator from '$lib/InputLengthIndicator.svelte';
	import { getBuildWithIdenticalSchematics } from '$lib/api/builds';
	import { getImageUrl } from '$lib/api/storage';
	import SchematicChip from '$lib/chips/SchematicChip.svelte';
	import VersionChip from '$lib/chips/VersionChip.svelte';
	import { getResources } from '$lib/minecraft/mcmetaAPI';
	import { getStructureBlockList, getStructureHash, getStructureSize } from '$lib/minecraft/utils';
	import { FileButton, ProgressRadial, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { debounce } from 'lodash';
	import prettyBytes from 'pretty-bytes';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import AssetViewerSection from '../AssetViewerSection.svelte';

	export let data;

	let { supabase, build, schematic, buildId, user } = data;
	$: ({ supabase, build, schematic, buildId, user } = data);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let resources: Resources;
	let blockNavigation = true;

	onMount(async () => {
		resources = await getResources();

		// Show browser warning when refreshing the page or navigate to an external URL
		window.addEventListener('beforeunload', function (e) {
			if (blockNavigation) {
				e.preventDefault();
				e.returnValue = '';
			}
		});
	});

	beforeNavigate((navigation) => {
		// Show discard changes dialog before navigating to another router link
		if (blockNavigation) {
			navigation.cancel();
			showCancelConfirmationDialog(navigation.to?.url.href);
		}
	});

	// Title
	let title = build?.title ?? '';
	const titleMaxLength = 80;
	const titleMinLength = 5;

	// Description
	let description = build?.description ?? '';
	let descriptionTextAreaEl: HTMLTextAreaElement;
	$: if (description && descriptionTextAreaEl) {
		descriptionTextAreaEl.style.height = '';
		descriptionTextAreaEl.style.height = descriptionTextAreaEl.scrollHeight + 2 + 'px';
	}
	const descriptionMaxLength = 5000;

	// Extra Schematics
	let newExtraSchematics = build?.extraSchematics ?? [];

	// async function openSelectSchematicModal() {
	// 	const modal: ModalSettings = {
	// 		type: 'component',
	// 		component: {
	// 			ref: SelectSchematicModal,
	// 			props: { supabase, resources, schematics: userSchematics, selected: extraSchematics },
	// 			slot: '<p>Skeleton</p>'
	// 		},
	// 		response: (v: Tables<'schematics'>) => {
	// 			if (v) extraSchematics = [...extraSchematics, v];
	// 		}
	// 	};
	// 	modalStore.trigger(modal);
	// }

	// Extra Images
	type UploadStatus = 'pending' | 'success' | 'error';
	type ImageItem = { path: string; size?: number; status: UploadStatus };
	let newImageFiles: FileList | undefined;
	let imageFiles: ImageItem[] =
		build?.extra_images.map((path) => ({ path, status: 'success' })) ?? [];
	$: if (newImageFiles) handleNewImages(newImageFiles);

	const debouncedRefreshImageFiles = debounce(() => (imageFiles = imageFiles), 500);

	function handleNewImages(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.substring(file.name.lastIndexOf('.'));
			const path = `${user.id}/${crypto.randomUUID()}${extension}`;
			let imageItem = { path, size: file.size, status: 'pending' as UploadStatus };
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

	function handleDeleteImage(idx: number) {
		imageFiles.splice(idx, 1);
		imageFiles = imageFiles;
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

	let selectedTags: Tables<'tags'>[] = build?.buildTags ?? [];

	// Versions

	let testedInVersion: number | undefined = build?.tested_in_version || undefined;
	let worksInVersion: number | undefined = build?.works_in_version || undefined;
	let breaksInVersion: number | undefined = build?.breaks_in_version || undefined;

	// Schematic hash

	let schematicHash = build?.schematic_hash;
	let duplicateInfo: Awaited<ReturnType<typeof getBuildWithIdenticalSchematics>> | null = null;
	$: if (schematic && browser) updateSchematicHashAndDuplicateInfo();

	async function updateSchematicHashAndDuplicateInfo() {
		if (build) return (schematicHash = build.schematic_hash);
		const { data, error: storageError } = await supabase.storage
			.from('schematics')
			.download(schematic.object_path);
		if (storageError) throw storageError;
		const schemaData = await data.arrayBuffer();
		schematicHash = await getStructureHash(schemaData);
		duplicateInfo = await getBuildWithIdenticalSchematics(supabase, user.id, schematicHash);
	}

	// Form handling

	async function handleSubmit() {
		const userId = user.id.toString();
		if (!schematicHash) {
			updateSchematicHashAndDuplicateInfo();
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> Sorry, there was an error generating metadata for this build. Please try again.`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}

		// Define parameters for update build
		let baseQuery = supabase.from('builds');
		const baseParams = {
			title: title,
			description,
			tested_in_version: testedInVersion,
			works_in_version: worksInVersion,
			breaks_in_version: breaksInVersion,
			extra_images: imageFiles.map((v) => v.path),
			extra_schematics: newExtraSchematics.map((v) => v.id)
		};

		// Define query for update or create build
		let query;
		if (build) {
			query = baseQuery.update(baseParams).eq('id', buildId);
		} else {
			const { data, error: storageError } = await supabase.storage
				.from('schematics')
				.download(schematic.object_path);
			if (storageError) throw storageError;
			const schemaData = await data.arrayBuffer();
			const sizeDimensions = getStructureSize(schemaData);
			const blockCounts = getStructureBlockList(schemaData);
			query = baseQuery.insert({
				...baseParams,
				size_dimensions: [sizeDimensions.x, sizeDimensions.y, sizeDimensions.z],
				block_counts: blockCounts,
				id: buildId,
				user_id: userId,
				schematic_hash: schematicHash
			});
		}

		// Run query
		const { error } = await query;
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		toastStore.trigger({
			message: `<i class="fas fa-check mr-1"></i> ${build ? 'Updated' : 'Published'} Build!`,
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		blockNavigation = false;
		goto(`/builds/${buildId}`, { replaceState: true });
	}

	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as Element;
		e.key == 'Enter' && target.tagName !== 'TEXTAREA' && e.preventDefault();
	}

	function showCancelConfirmationDialog(href: string = '.') {
		modalStore.trigger({
			type: 'confirm',
			title: 'Discard Changes',
			body: 'Any changes you have made will be lost.',
			response: async (r: boolean) => {
				if (r) {
					blockNavigation = false;
					goto(href ?? (build ? '.' : `/users/${user.numeric_id}`), { replaceState: true });
				}
			}
		});
	}

	function showSubmitConfirmationDialog() {
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

	function openSelectSchematicsModal() {
		modalStore.trigger({
			type: 'component',
			component: 'selectSchematicsModal',
			meta: { schematics: newExtraSchematics, userId: build?.author.id },
			response: (r) => {
				if (r !== undefined) {
					newExtraSchematics = r;
				}
			}
		});
	}

	function openSelectTestedInVersionModal() {
		modalStore.trigger({
			type: 'component',
			component: 'selectMcVersionModal',
			meta: { mcVersion: testedInVersion, allowSnapshots: true },
			response: (r) => r !== undefined && (testedInVersion = r)
		});
	}

	function openSelectWorksInVersionModal() {
		modalStore.trigger({
			type: 'component',
			component: 'selectMcVersionModal',
			meta: { mcVersion: worksInVersion },
			response: (r) => r !== undefined && (worksInVersion = r)
		});
	}

	function openSelectBreaksInVersionModal() {
		modalStore.trigger({
			type: 'component',
			component: 'selectMcVersionModal',
			meta: { mcVersion: breaksInVersion },
			response: (r) => r !== undefined && (breaksInVersion = r)
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
	on:submit|preventDefault={showSubmitConfirmationDialog}
>
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Back
	</a>

	<div>
		{#if duplicateInfo?.publishedBySelf?.length}
			<blockquote class="alert variant-soft-warning my-5">
				<i class="fa-solid fa-circle-exclamation w-10 text-3xl" />
				<div class="alert-message">
					This schematic is identical to another one you have created!
				</div>
				<div class="max-w-md space-x-2 w-full truncate text-end">
					{#each duplicateInfo?.publishedBySelf as b}
						<a href={`/builds/${b.id}`} class="anchor" target="_blank">#{b.id}</a>
					{/each}
				</div>
			</blockquote>
		{/if}
		{#if duplicateInfo?.publishedByOthers?.length}
			<blockquote class="alert variant-soft-warning my-5">
				<i class="fa-solid fa-circle-exclamation w-10 text-3xl" />
				<div class="alert-message">This schematic is identical to one created by another user!</div>
				<div class="max-w-md space-x-2 w-full truncate text-end">
					{#each duplicateInfo?.publishedByOthers as b}
						<a href={`/builds/${b.id}`} class="anchor" target="_blank">#{b.id}</a>
					{/each}
				</div>
			</blockquote>
		{/if}
	</div>

	<h1
		class="font-bold leading-none tracking-tight text-gray-900 dark:text-white h2 my-10"
		class:opacity-40={!title}
	>
		{#if title}{title}{:else}No title...{/if}
	</h1>

	<label class=" mb-5">
		<div class="px-3 label mb-2">Build Title*</div>
		<input
			type="text"
			class="input"
			id="build-title"
			bind:value={title}
			name="name"
			required
			placeholder="Enter title here..."
			maxlength={titleMaxLength}
			minlength="5"
		/>
		<InputLengthIndicator text={title} minLength={titleMinLength} maxLength={titleMaxLength} />
	</label>

	<div class="mb-10">
		<div class="px-3 label mb-2">Preview</div>
		{#key imageFiles}
			<AssetViewerSection
				{supabase}
				{schematic}
				extraImagePaths={imageFiles.map((v) => v.path)}
				extraSchematics={newExtraSchematics}
			/>
		{/key}
	</div>

	<!-- Extra Assets -->
	<div class="mb-5">
		<div class="px-3 label mb-2">Extra Assets</div>

		<!-- Schematics -->
		<div class="flex gap-3 items-center mb-3">
			<button class="btn variant-filled-primary" type="button" on:click={openSelectSchematicsModal}>
				<i class="fas fa-ruler-combined mr-2" />
				Extra Schematics
			</button>

			<div class="opacity-30">
				{newExtraSchematics.length || 'None'}
				Selected
			</div>
		</div>
		<!-- Schematic list -->
		<div class="flex gap-3 px-3 mb-4">
			{#each newExtraSchematics as schematic}
				<SchematicChip schematicId={schematic.id} showLink />
			{/each}
		</div>

		<!-- Extra Images -->
		<div class="mt-2 flex gap-3 items-center">
			<FileButton
				name="images"
				button="btn variant-filled-primary"
				multiple
				bind:files={newImageFiles}
			>
				<i class="fas fa-image mr-2" />
				Extra Images
			</FileButton>
			<div class="opacity-30">
				{imageFiles.length || 'None'}
				Selected
			</div>
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
					{item.size ? prettyBytes(item.size) : '-'}
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
					on:click={() => handleDeleteImage(i)}
				>
					<i class="fa-regular fa-trash-can" />
				</button>
			{/each}
		</div>
	</div>

	<!-- Description -->
	<label class="mb-5">
		<div class="label mb-2 px-3">Description</div>
		<textarea
			class="textarea resize-none"
			rows="8"
			placeholder="Enter description here..."
			bind:this={descriptionTextAreaEl}
			name="description"
			bind:value={description}
			maxlength={descriptionMaxLength}
		/>
		<InputLengthIndicator text={description} maxLength={descriptionMaxLength} />
	</label>

	<div class="mb-10">
		<div class="px-3 mb-3 label">Minecraft Version Compatibility</div>
		<div class="grid grid-cols-2 w-fit gap-4 mb-5 items-center">
			<!-- Tested Version -->
			<button
				class="btn variant-filled-primary"
				type="button"
				on:click={openSelectTestedInVersionModal}
			>
				<i class="fa-solid fa-clipboard-check mr-3" />
				Tested In
			</button>
			<div class="flex gap-3">
				{#if testedInVersion}
					<VersionChip version={testedInVersion} type="tested" />
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

			<!-- Working Version -->
			<button
				class="btn variant-filled-primary"
				type="button"
				on:click={openSelectWorksInVersionModal}
			>
				<i class="fa-solid fa-circle-check mr-3" />
				Starts Working In
			</button>
			<div class="flex gap-3">
				{#if worksInVersion}
					<VersionChip version={worksInVersion} type="working" />
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

			<!-- Breaking Version -->
			<button
				class="btn variant-filled-primary"
				type="button"
				on:click={openSelectBreaksInVersionModal}
			>
				<i class="fa-solid fa-triangle-exclamation mr-3" />
				Breaks In
			</button>

			<div class="flex gap-3">
				{#if breaksInVersion}
					<VersionChip version={breaksInVersion} type="breaking" />
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

		<blockquote class="alert variant-soft-secondary">
			<i class="fa-solid fa-circle-info w-10 text-3xl" />
			<div class="alert-message">
				It is recommended to at least enter a <b>Tested In</b>
				version if you do not know what version your build starts working with.
			</div>
		</blockquote>
	</div>

	<!-- Tags -->
	<div class="mb-10">
		<div class="label mb-2">Tags</div>
		<div class="flex gap-4 items-center">
			<button class="btn variant-filled-primary" type="button">
				<i class="fa-solid fa-tag mr-3" />
				Edit Tags
			</button>
			<div class="flex gap-2 flex-wrap">
				{#each selectedTags as tag (tag)}
					<div
						class="chip variant-soft-primary h-fit"
						in:fade={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
					>
						<i class="fa-solid fa-hashtag mr-2" />
						{tag.name}
						<button
							type="button"
							class=""
							on:click={() => (selectedTags = selectedTags.filter((t) => t.id !== tag.id))}
						>
							<i class="fa-solid fa-close" />
						</button>
					</div>
				{:else}
					<div class="opacity-50">None Selected</div>
				{/each}
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
		<button
			class="btn variant-filled-surface"
			type="button"
			on:click={() => showCancelConfirmationDialog()}
		>
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

<style lang="postcss">
	.label {
		@apply font-semibold text-lg;
	}
</style>
