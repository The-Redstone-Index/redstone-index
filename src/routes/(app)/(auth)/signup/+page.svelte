<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUsernameErrorMessage } from '$lib/utils.js';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data;
	$: ({ supabase } = data);

	let email = '';
	let password = '';
	let username = '';
	let errorMessage = '';
	let waitForConfirmation = false;
	let acceptedTermsOfService = false;

	const signUpToast: ToastSettings = {
		message: 'Welcome to The Redstone Index!',
		background: 'variant-filled-primary',
		classes: 'pl-8'
	};

	async function onSubmit() {
		const result = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: origin,
				data: { initial_username: username }
			}
		});
		if (result.error) {
			errorMessage = getUsernameErrorMessage(result.error.message);
		} else {
			toastStore.trigger(signUpToast);
			waitForConfirmation = true;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - The Redstone Index</title>
	<meta
		name="description"
		content="Join The Redstone Index community today! Sign up to share your amazing redstone contraptions."
	/>
</svelte:head>

<form class="card p-7 flex flex-col gap-5 w-full max-w-lg" on:submit|preventDefault={onSubmit}>
	<div class="flex justify-between">
		<h1 class="font-semibold !text-2xl">
			{#if waitForConfirmation}
				Waiting for Email Confirmation!
			{:else}
				New Account
			{/if}
		</h1>
		<i class="fa-solid fa-user-plus mx-1 text-surface-600-300-token text-2xl" />
	</div>

	{#if waitForConfirmation}
		<blockquote class="blockquote opacity-50">{email}</blockquote>
		<div>If this email exists, an email confirmation link appear in your inbox.</div>
	{:else}
		<label>
			<div class="mb-1">Email</div>
			<input
				class="input"
				type="email"
				name="email"
				placeholder="email"
				bind:value={email}
				required
			/>
		</label>

		<label>
			<div class="mb-1">Password</div>
			<input
				class="input"
				type="password"
				name="password"
				placeholder="password"
				bind:value={password}
				required
			/>
		</label>

		<label>
			<div class="mb-1">Username</div>
			<input
				class="input"
				type="text"
				name="username"
				placeholder="username"
				bind:value={username}
				required
			/>
		</label>

		<label class="flex gap-3 items-center">
			<input type="checkbox" class="checkbox" bind:checked={acceptedTermsOfService} required />
			<span>
				I have read and agree to the
				<a href="/terms-of-service" target="_blank" class="!no-underline hover:!underline">
					Terms of Service
				</a>
			</span>
		</label>

		{#if errorMessage}
			<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
				<i class="fa-solid fa-triangle-exclamation" />
				{errorMessage}
			</div>
		{/if}

		<button class="btn variant-filled-primary mt-2">Sign Up</button>
	{/if}
</form>
