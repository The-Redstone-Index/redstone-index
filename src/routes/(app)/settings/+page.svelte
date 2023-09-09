<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import SelectMinecraftFaceDialog from '$lib/SelectMinecraftFaceDialog.svelte';
	import AutoResizeTextarea from '$lib/inputs/AutoResizeTextarea.svelte';
	import { getAvatarUrl, getUsernameErrorMessage } from '$lib/utils.js';
	import {
		Avatar,
		FileButton,
		ProgressRadial,
		clipboard,
		getModalStore,
		getToastStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { v4 } from 'uuid';

	export let data;
	let { session, profile, settings, supabase } = data;
	$: ({ session, profile, settings, supabase } = data);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	onMount(async () => {
		if (profile.avatar_url) displayAvatar(profile.avatar_url);
	});

	// Avatar
	let photoFiles: FileList | undefined;
	let photoUploading = false;
	$: if (photoFiles) uploadAndSetFileAvatar(photoFiles);
	let newAvatarPath: string | null = ''; // string => photo, null => initials
	let displayedAvatarUrl = '';
	$: newAvatarSelected = newAvatarPath != '';

	async function displayAvatar(path: string | null) {
		if (path == null) return (displayedAvatarUrl = '');
		displayedAvatarUrl = (await getAvatarUrl(supabase, path)) || '';
	}

	async function _uploadAndSetAvatar(newAvatarPath: string, fileData: File | Blob) {
		photoUploading = true;
		const { data, error } = await supabase.storage.from('avatars').upload(newAvatarPath, fileData);
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

	async function uploadAndSetFileAvatar(photoFiles: FileList) {
		const file = photoFiles[0];
		const uuid = v4();
		const extension = file.name.substring(file.name.lastIndexOf('.'));
		newAvatarPath = `${uuid}${extension}`;
		await _uploadAndSetAvatar(newAvatarPath, file);
	}

	async function uploadAndSetBlobAvatar(blob: Blob) {
		const uuid = v4();
		newAvatarPath = `${uuid}.png`;
		await _uploadAndSetAvatar(newAvatarPath, blob);
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

	function cancelAndResetAvatar() {
		// Delete the new avatar if it was selected (meaning it was uploaded and pending confirm)
		if (newAvatarPath) supabase.storage.from('avatars').remove([newAvatarPath]);
		resetAvatarForm();
	}

	async function updateUserAvatar() {
		// Change avatar in database
		const { error } = await supabase
			.from('user_profiles')
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
		// Delete the old avatar (image is no longer used)
		if (profile.avatar_url) supabase.storage.from('avatars').remove([profile.avatar_url]);
		// Reset form and show toast
		if (profile) profile.avatar_url = newAvatarPath;
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
			component: {
				ref: SelectMinecraftFaceDialog,
				props: { background: 'bg-red-500' },
				slot: '<p>Skeleton</p>'
			},
			response: (v) => v && uploadAndSetBlobAvatar(v)
		};
		modalStore.trigger(modal);
	}

	// Bio
	let bio = profile.bio;
	$: bioChanged = profile.bio != bio;

	async function updateBio() {
		const { error } = await supabase.from('user_profiles').update({ bio }).eq('id', profile.id);
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
		bio = profile.bio;
	}

	// Username
	let username = profile.username;
	$: usernameChanged = profile.username != username;
	let usernameError = false;
	$: username && (usernameError = false);

	async function updateUsername() {
		const { error } = await supabase
			.from('user_profiles')
			.update({ username: username })
			.eq('id', profile.id);
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
		username = profile.username;
	}

	// API token
	let apiToken = settings.api_token;
	let apiTokenCopied = false;
	$: apiTokenChanged = apiToken != settings.api_token;

	function handleCopyApiToken() {
		apiTokenCopied = true;
		setTimeout(() => (apiTokenCopied = false), 1500);
	}

	function generateApiToken() {
		const apiTokenBytes = crypto.getRandomValues(new Uint8Array(6));
		apiToken = Array.from(apiTokenBytes, (byte) => byte.toString(10).padStart(2, '0')).join('');
	}

	function resetApiToken() {
		apiToken = settings.api_token;
	}

	async function updateApiToken() {
		const { error } = await supabase
			.from('user_settings')
			.update({ api_token: apiToken })
			.eq('id', profile.id);
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
		if (!session.user?.email) return alert('Error: User email not provided.');
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
					initials={profile.username}
					cursor="cursor-pointer"
				/>
			{/if}
		</div>
		<div class="flex gap-5">
			<!-- Buttons to set avatar to photo / initials -->
			<div class:hidden={!!photoFiles || newAvatarSelected}>
				<FileButton name="files" button="btn variant-filled-primary" bind:files={photoFiles}>
					Upload New Image
				</FileButton>
			</div>
			{#if !newAvatarSelected}
				<button class="btn btn-icon variant-filled-primary" on:click={openSelectFaceDialog}>
					<img
						src="/steve_face.png"
						alt="Minecraft Face"
						class="w-4 grayscale opacity-70 brightness-[300%]"
						style="image-rendering: pixelated;"
					/>
				</button>
			{/if}
			{#if profile.avatar_url != null && !newAvatarSelected}
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
			<div class="relative group">
				<AutoResizeTextarea
					name="Bio"
					id="bio"
					class="mb-4"
					rows={3}
					placeholder="Write something about yourself..."
					bind:value={bio}
				/>
				<i
					class="fa-solid fa-pencil absolute right-4 top-3 opacity-50 group-focus-within:opacity-0 transition-opacity"
				/>
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
	<div class="flex gap-5 items-center flex-col sm:flex-row">
		<label for="username" class="w-auto sm:w-24">Username</label>
		<div class="relative max-w-md w-full group flex-1">
			<input
				id="username"
				type="text"
				bind:value={username}
				class="input"
				class:input-error={usernameError}
			/>
			<i
				class="fa-solid fa-pencil absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-0 transition-opacity"
			/>
		</div>
		{#if usernameChanged}
			<div class="flex gap-5" transition:fade={{ duration: 100 }}>
				<button class="btn variant-soft-primary" on:click={updateUsername}>
					<i class="fas fa-check mr-3" />
					Update
				</button>
				<button class="btn variant-soft" on:click={resetUsername}>
					<i class="fas fa-xmark mr-3" />
					Cancel
				</button>
			</div>
		{/if}
	</div>

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
