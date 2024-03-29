<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import InputLengthIndicator from '$lib/InputLengthIndicator.svelte';
	import { avatarsBucket } from '$lib/config.js';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { getAvatarUrl } from '$lib/supabase-api/storage.js';
	import { getUsernameErrorMessage } from '$lib/utils.js';
	import {
		Avatar,
		FileButton,
		ProgressRadial,
		clipboard,
		getModalStore,
		getToastStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import prettyBytes from 'pretty-bytes';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { v4 } from 'uuid';

	export let data;
	let { session, user, supabase } = data;
	$: ({ session, user, supabase } = data);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	onMount(async () => {
		if (user.avatar_path) displayAvatar(user.avatar_path);
	});

	// Avatar
	let photoFiles: FileList | undefined;
	let photoUploading = false;
	$: if (photoFiles) uploadFileAndSetAvatar(photoFiles);
	let newAvatarPath: string | null = ''; // string => photo, null => initials
	let displayedAvatarUrl = '';
	$: newAvatarSelected = newAvatarPath != '';

	async function displayAvatar(path: string | null) {
		if (path == null) return (displayedAvatarUrl = '');
		displayedAvatarUrl = getAvatarUrl(supabase, path) || '';
	}

	async function _uploadAndSetAvatar(newAvatarPath: string, fileData: File | Blob) {
		// Validate file size
		const { size } = fileData;
		const { maxSize } = avatarsBucket;
		if (size > maxSize) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> Max size for avatar images is ${prettyBytes(
					maxSize
				)}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return resetAvatarForm();
		}
		// Upload file
		photoUploading = true;
		const { data, error } = await supabase.storage.from('avatars').upload(newAvatarPath, fileData);
		photoUploading = false;
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return resetAvatarForm();
		}
		if (data) {
			displayAvatar(data.path);
		}
	}

	async function uploadFileAndSetAvatar(photoFiles: FileList) {
		const file = photoFiles[0];
		const uuid = v4();
		const extension = file.name.substring(file.name.lastIndexOf('.'));
		newAvatarPath = `${user.id}/${uuid}${extension}`;
		await _uploadAndSetAvatar(newAvatarPath, file);
	}

	async function uploadBlobAndSetAvatar(blob: Blob) {
		const uuid = v4();
		newAvatarPath = `${user.id}/${uuid}.png`;
		await _uploadAndSetAvatar(newAvatarPath, blob);
	}

	function useInitialsAvatar() {
		newAvatarPath = null;
		displayAvatar(newAvatarPath);
	}

	function resetAvatarForm() {
		photoFiles = undefined;
		newAvatarPath = '';
		displayAvatar(user.avatar_path || null);
	}

	function cancelAndResetAvatar() {
		// Delete the avatar image that was uploaded and pending confirmation
		if (newAvatarPath) supabase.storage.from('avatars').remove([newAvatarPath]);
		resetAvatarForm();
	}

	async function updateUserAvatar() {
		// Change avatar in database
		// (old avatar images will be automatically deleted via trigger)
		const { error } = await supabase
			.from('users')
			.update({ avatar_path: newAvatarPath })
			.eq('id', user.id);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> Failed to change avatar. Please try again later. ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		// Reset form and show toast
		if (user) user.avatar_path = newAvatarPath;
		resetAvatarForm();
		toastStore.trigger({
			message: 'Avatar Changed!',
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		// invalidate layout data which contains appbar
		await invalidateAll();
	}

	async function openSelectFaceDialog() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'selectMinecraftFaceModal',
			meta: { username: user.username },
			response: (v) => v && uploadBlobAndSetAvatar(v)
		};
		modalStore.trigger(modal);
	}

	// Bio
	let bio = user.bio;
	$: bioChanged = user.bio != bio;

	async function updateBio() {
		const { error } = await supabase.from('users').update({ bio }).eq('id', user.id);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		await invalidateAll();
		toastStore.trigger({
			message: 'Bio updated!',
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
	}

	function resetBio() {
		bio = user.bio;
	}

	// Username
	let username = user.username;
	$: usernameChanged = user.username != username;
	let usernameError = false;
	$: username && (usernameError = false);

	async function updateUsername() {
		const { error } = await supabase.from('users').update({ username }).eq('id', user.id);
		if (error) {
			const message = getUsernameErrorMessage(error.message);
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			usernameError = true;
			return;
		}
		await invalidateAll();
		toastStore.trigger({
			message: 'Username Changed!',
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
	}

	function resetUsername() {
		username = user.username;
	}

	// API token
	let apiToken = user.private.api_token;
	let apiTokenCopied = false;
	$: apiTokenChanged = apiToken != user.private.api_token;

	function handleCopyApiToken() {
		apiTokenCopied = true;
		setTimeout(() => (apiTokenCopied = false), 1500);
	}

	function generateApiToken() {
		const apiTokenBytes = crypto.getRandomValues(new Uint8Array(6));
		apiToken = Array.from(apiTokenBytes, (byte) => byte.toString(10).padStart(2, '0')).join('');
	}

	function resetApiToken() {
		apiToken = user.private.api_token;
	}

	async function updateApiToken() {
		const { error } = await supabase
			.from('users_private')
			.update({ api_token: apiToken })
			.eq('id', user.id);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		await invalidateAll();
		toastStore.trigger({
			message: `API token ${apiToken ? 'updated' : 'removed'}!`,
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
	}

	// Password
	let resetPasswordTimer = 0;

	async function sendResetPasswordEmail() {
		if (!session.user.email) return alert('Error: User email not provided.');
		const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
			redirectTo: origin
		});
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		} else {
			resetPasswordTimer = 30;
			toastStore.trigger({
				message: 'Password Reset Email Sent!',
				background: 'variant-filled-primary',
				classes: 'pl-8'
			});
		}
	}

	onMount(() => {
		const timerId = setInterval(() => resetPasswordTimer > 0 && resetPasswordTimer--, 1000);
		return () => clearInterval(timerId);
	});
</script>

<svelte:head>
	<title>User Settings - The Redstone Index</title>
	<meta
		name="description"
		content="Customize your Redstone Index profile settings. Manage your preferences and API key for a personalized experience."
	/>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5">
	<h1 class="h1">User Settings</h1>
</div>

<div class="container mx-auto flex flex-col gap-10 p-3 mb-20">
	<!-- Avatar -->
	<div class="flex gap-5 items-center flex-col sm:flex-row">
		<div class="w-auto sm:w-24">Avatar</div>
		<div class="h-52 w-52 grid place-items-center">
			{#if photoUploading}
				<ProgressRadial stroke={150} width="w-40" />
			{:else}
				<Avatar
					width="w-52"
					src={displayedAvatarUrl}
					initials={user.username}
					cursor="cursor-pointer"
				/>
			{/if}
		</div>
		<div class="flex gap-3">
			<!-- Buttons to set avatar to photo / initials -->
			<div class:hidden={!!photoFiles || newAvatarSelected}>
				<FileButton
					name="files"
					button="btn variant-filled-primary flex gap-2 items-center"
					accept={avatarsBucket.acceptTypes}
					bind:files={photoFiles}
				>
					<i class="fa-regular fa-image h-5" />
					Upload Image
				</FileButton>
			</div>
			{#if !newAvatarSelected}
				<button
					class="btn variant-filled-primary flex gap-2 items-center"
					on:click={openSelectFaceDialog}
				>
					<img
						src="/steve_face.png"
						alt="Minecraft Face"
						class="w-4 grayscale opacity-70 brightness-[300%]"
						style="image-rendering: pixelated;"
					/>
					Minecraft Face
				</button>
			{/if}
			{#if user.avatar_path != null && !newAvatarSelected}
				<button class="btn btn-icon variant-filled-primary" on:click={useInitialsAvatar}>
					<i class="fa-regular fa-trash-can" />
				</button>
			{/if}

			<!-- Show confirm buttons if new avatar is null or string -->
			{#if newAvatarSelected && !photoUploading}
				<button
					class="btn variant-soft-primary"
					on:click={updateUserAvatar}
					in:fade={{ duration: 100 }}
				>
					<i class="fas fa-check mr-3" />
					Use this Avatar
				</button>
				<button
					class="btn variant-soft"
					on:click={cancelAndResetAvatar}
					in:fade={{ duration: 100 }}
				>
					<i class="fas fa-xmark mr-3" />
					Cancel
				</button>
			{/if}
		</div>
	</div>

	<!-- Bio -->
	<div class="flex gap-5 flex-col sm:flex-row">
		<label for="bio" class="w-auto sm:w-24 mt-9">Bio</label>
		<div class="w-full max-w-5xl">
			<div class="relative group mb-2">
				<AutoResizeTextarea
					name="Bio"
					id="bio"
					class="mb-2"
					rows={3}
					placeholder="Write something about yourself..."
					bind:value={bio}
					maxlength={1000}
				/>
				<i
					class="fa-solid fa-pencil absolute right-4 top-3 opacity-50 group-focus-within:opacity-0 transition-opacity"
				/>
				<InputLengthIndicator text={bio} maxLength={1000} />
			</div>
			{#if bioChanged}
				<div class="flex gap-5 justify-center" transition:fade={{ duration: 100 }}>
					<button class="btn variant-soft-primary" on:click={updateBio}>
						<i class="fas fa-check mr-3" />
						Update
					</button>
					<button class="btn variant-soft" on:click={resetBio}>
						<i class="fas fa-xmark mr-3" />
						Cancel
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Username -->
	<form class="flex gap-5 items-center flex-col sm:flex-row" on:submit|preventDefault>
		<label for="username" class="w-auto sm:w-24">Username</label>
		<div class="relative max-w-md w-full group flex-1">
			<input
				id="username"
				type="text"
				bind:value={username}
				class="input"
				class:input-error={usernameError}
				minlength={3}
				maxlength={30}
			/>
			<i
				class="fa-solid fa-pencil absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-0 transition-opacity"
			/>
		</div>
		{#if usernameChanged}
			<div class="flex gap-5" transition:fade={{ duration: 100 }}>
				<button class="btn variant-soft-primary" on:click={updateUsername} type="submit">
					<i class="fas fa-check mr-3" />
					Update
				</button>
				<button class="btn variant-soft" on:click={resetUsername} type="button">
					<i class="fas fa-xmark mr-3" />
					Cancel
				</button>
			</div>
		{/if}
	</form>

	<!-- API token -->
	<div class="flex gap-5 items-center flex-col sm:flex-row">
		<div class="w-auto sm:w-24 whitespace-nowrap">API Token</div>
		<div class="relative max-w-md w-full flex-1">
			<input class="input !h-12" type="text" value={apiToken} placeholder="No API token" readonly />
			{#if apiToken}
				<button
					class="btn btn-sm variant-filled absolute right-2 top-1/2 -translate-y-1/2"
					use:clipboard={apiToken}
					on:click={handleCopyApiToken}
					disabled={apiTokenCopied || apiTokenChanged}
					transition:fade={{ duration: 100 }}
				>
					{apiTokenCopied ? 'Copied!' : 'Copy'}
				</button>
			{/if}
		</div>
		{#if apiTokenChanged}
			<div class="flex gap-5" in:fade={{ duration: 100 }}>
				<button class="btn variant-soft-primary" on:click={updateApiToken}>
					<i class="fas fa-check mr-3" />
					Confirm
				</button>
				<button class="btn variant-soft" on:click={resetApiToken}>
					<i class="fas fa-xmark mr-3" />
					Cancel
				</button>
			</div>
		{:else}
			<div class="flex gap-5">
				<button class="btn variant-filled-primary" on:click={generateApiToken}>
					{#if apiToken}Re-Generate{:else}Generate{/if}
				</button>
				{#if apiToken != null}
					<button class="btn btn-icon variant-filled-primary" on:click={() => (apiToken = null)}>
						<i class="fa-regular fa-trash-can" />
					</button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Email -->
	<div class="flex gap-5 items-center flex-col sm:flex-row">
		<label for="bio" class="w-auto sm:w-24">Email</label>
		<div class="relative max-w-md w-full group flex-1">
			<input id="email" type="text" value={session.user.email} class="input" readonly />
		</div>
	</div>

	<!-- Reset Password -->
	<div class="flex gap-5 items-center flex-col sm:flex-row">
		<div class="whitespace-nowrap">Reset Password</div>
		<button
			class="btn variant-filled"
			disabled={!!resetPasswordTimer}
			on:click={sendResetPasswordEmail}
		>
			{#if resetPasswordTimer}
				{resetPasswordTimer}
			{:else}
				Send Reset Password Link
			{/if}
		</button>
	</div>
</div>
