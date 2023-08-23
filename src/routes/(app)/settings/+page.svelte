<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import { getAvatarUrl, getUsernameErrorMessage } from '$lib/utils.js';
	import {
		Avatar,
		FileButton,
		ProgressBar,
		clipboard,
		toastStore,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { v4 } from 'uuid';

	export let data;
	let { profile, supabase } = data;
	$: ({ profile, supabase } = data);

	onMount(async () => {
		if (profile.avatar_url) displayAvatar(profile.avatar_url);
	});

	// Avatar
	let photoFiles: FileList | undefined;
	let photoUploading = false;
	$: if (photoFiles) useUploadedAvatar(photoFiles);
	let newAvatarPath: string | null = ''; // string => photo, null => initials
	let displayedAvatarUrl = '';
	$: newAvatarSelected = newAvatarPath != '';

	async function displayAvatar(path: string | null) {
		if (path == null) return (displayedAvatarUrl = '');
		displayedAvatarUrl = (await getAvatarUrl(supabase, path)) || '';
	}

	async function useUploadedAvatar(photoFiles: FileList) {
		const file = photoFiles[0];
		const uuid = v4();
		const extension = file.name.substring(file.name.lastIndexOf('.'));
		newAvatarPath = `${uuid}${extension}`;
		photoUploading = true;
		const { data, error } = await supabase.storage.from('avatars').upload(newAvatarPath, file);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			resetAvatarForm();
		}
		if (data) {
			displayAvatar(data.path);
		}
		photoUploading = false;
	}

	function useInitialsAvatar() {
		newAvatarPath = null;
		displayAvatar(newAvatarPath);
	}

	function resetAvatarForm() {
		photoFiles = undefined;
		newAvatarPath = '';
		displayAvatar(profile.avatar_url || null);
	}

	async function updateUserAvatar() {
		const { error } = await supabase
			.from('profiles')
			.update({ avatar_url: newAvatarPath })
			.eq('id', profile.id);
		if (error) {
			alert('Failed to change avatar. Please try again');
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		if (profile) profile.avatar_url = newAvatarPath;
		resetAvatarForm();
		toastStore.trigger({
			message: 'Avatar Changed!',
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		await invalidateAll(); // invalidate layout data which contains appbar
	}

	// Username
	let username = profile.username;
	$: usernameChanged = profile.username != username;

	async function updateUsername() {
		const { error } = await supabase
			.from('profiles')
			.update({ username: username })
			.eq('id', profile.id);
		if (error) {
			const message = getUsernameErrorMessage(error.message);
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		await invalidateAll();
		toastStore.trigger({
			message: 'Username Changed!',
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
	}

	// API token
	let apiTokenCopied = false;

	function handleCopyApiToken() {
		apiTokenCopied = true;
		setTimeout(() => (apiTokenCopied = false), 1500);
	}
</script>

<svelte:head>
	<title>User Settings - Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5">
	<h1>User Settings</h1>
</div>

<div class="container mx-auto flex flex-col gap-10 p-3">
	{#if profile}
		<div class="flex gap-5 items-center flex-col sm:flex-row">
			<span>Avatar</span>
			<Avatar
				width="w-52"
				src={displayedAvatarUrl}
				initials={profile.username}
				cursor="cursor-pointer"
			/>
			{#if photoUploading}
				<ProgressBar class="w-96" />
			{/if}

			<div class="flex gap-5">
				<!-- Buttons to set avatar to photo / initials -->
				<div class:hidden={!!photoFiles || newAvatarSelected}>
					<FileButton name="files" button="variant-filled-primary" bind:files={photoFiles}>
						Upload New Image
					</FileButton>
				</div>
				{#if profile.avatar_url != null && !newAvatarSelected}
					<button class="btn variant-filled-primary" on:click={useInitialsAvatar}>
						Use Initials
					</button>
				{/if}

				<!-- Show confirm buttons if new avatar is null or string -->
				{#if newAvatarSelected && !photoUploading}
					<button class="btn variant-soft-primary" on:click={updateUserAvatar}>
						<i class="fas fa-check mr-3" />

						Use this Avatar
					</button>
					<button class="btn variant-soft" on:click={resetAvatarForm}>
						<i class="fas fa-xmark mr-3" />
						Reset
					</button>
				{/if}
			</div>
		</div>
		<div class="flex gap-5 items-center flex-col sm:flex-row">
			<label for="username">Username</label>
			<input id="username" type="text" bind:value={username} class="input max-w-lg" />
			{#if usernameChanged}
				<button class="btn variant-filled-primary" on:click={updateUsername}>Update</button>
			{/if}
		</div>

		<div class="flex gap-5 items-center flex-col sm:flex-row">
			<span>API Token</span>
			<div class="relative max-w-lg w-full">
				<input
					class="input !h-12 "
					type="text"
					bind:value={profile.api_token}
					placeholder="No API token"
					disabled
				/>
				<button
					class="btn btn-sm variant-filled absolute right-2 top-1/2 -translate-y-1/2"
					use:clipboard={profile.api_token}
					on:click={handleCopyApiToken}
					disabled={apiTokenCopied || !profile.api_token}
				>
					{apiTokenCopied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<div class="flex gap-5">
				<button class="btn variant-filled-primary" disabled>Re-Generate</button>
				<button class="btn variant-soft-primary" use:clipboard={profile.api_token} disabled>
					Clear
				</button>
			</div>
		</div>

		<div class="flex gap-5 items-center flex-col sm:flex-row">
			<div>Reset Password</div>
			<button class="btn variant-filled" disabled>Send Reset Password Link</button>
		</div>
	{:else}
		<div class="my-20">
			<LoadingSpinnerArea />
		</div>
	{/if}
</div>
