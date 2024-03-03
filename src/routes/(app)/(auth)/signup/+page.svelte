<script lang="ts">
	import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { getUsernameErrorMessage } from '$lib/utils.js';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Turnstile } from 'svelte-turnstile';

	export let data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let errorMessage = '';
	let waitForConfirmation = false;
	let acceptedTermsOfService = false;

	const signUpToast: ToastSettings = {
		message: 'Welcome to The Redstone Index!',
		background: 'variant-filled-primary',
		classes: 'pl-8'
	};

	async function onSubmit(event: SubmitEvent) {
		if (password !== confirmPassword) {
			errorMessage = 'Confirm password does not match';
			return;
		}
		const formData = new FormData(event.target as HTMLFormElement);
		const captchaToken = formData.get('cf-turnstile-response') as string;
		const result = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.origin,
				data: { initial_username: username },
				captchaToken
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
			<label for="email" class="mb-1">Email</label>
			<input
				class="input"
				type="email"
				name="email"
				id="email"
				placeholder="user@example.com"
				bind:value={email}
				required
				autocomplete="username"
			/>
		</label>

		<label>
			<label for="password" class="mb-1">Password</label>
			<input
				class="input"
				type="password"
				name="password"
				id="password"
				placeholder="password"
				bind:value={password}
				required
				autocomplete="current-password"
			/>
		</label>

		<label>
			<label for="confirm-password" class="mb-1">Confirm Password</label>
			<input
				class="input"
				type="password"
				name="confirm-password"
				id="confirm-password"
				placeholder="password"
				bind:value={confirmPassword}
				required
				autocomplete="current-password"
				class:input-error={confirmPassword && confirmPassword !== password}
			/>
		</label>

		<label>
			<label for="username" class="mb-1">Username</label>
			<input
				class="input"
				type="text"
				name="username"
				id="username"
				placeholder="Username"
				bind:value={username}
				required
			/>
		</label>

		<label class="flex gap-3 items-center">
			<input type="checkbox" class="checkbox" bind:checked={acceptedTermsOfService} required />
			<span>
				I have read and agree to the
				<a href="/terms-of-service" target="_blank" class="anchor">Terms of Service</a>
			</span>
		</label>

		<div class="flex justify-center">
			<Turnstile siteKey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY} appearance="always" />
		</div>

		{#if errorMessage}
			<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
				<i class="fa-solid fa-triangle-exclamation" />
				{errorMessage}
			</div>
		{/if}

		<button class="btn variant-filled-primary mt-2">Sign Up</button>
	{/if}
</form>
