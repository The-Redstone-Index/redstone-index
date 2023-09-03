<script lang="ts">
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	export let data;
	$: ({ supabase } = data);

	let email = '';
	let errorMessage = '';
	let sent = false;
	let timer = 0;

	const resetPasswordToast: ToastSettings = {
		message: 'Password Reset Email Sent!',
		background: 'variant-filled-primary',
		classes: 'pl-8'
	};

	async function onSubmit() {
		const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: origin });
		if (result.error) {
			errorMessage = result.error.message;
		} else {
			sent = true;
			timer = 30;
			toastStore.trigger(resetPasswordToast);
		}
	}

	onMount(() => {
		const timerId = setInterval(() => timer > 0 && timer--, 1000);
		return () => clearInterval(timerId);
	});
</script>

<svelte:head>
	<title>Reset Password - The Redstone Index</title>
	<meta
		name="description"
		content="Reset your password for The Redstone Index. Regain access to your account."
	/>
</svelte:head>

<form class="card p-7 flex flex-col gap-5 w-full max-w-lg" on:submit|preventDefault={onSubmit}>
	<div class="flex justify-between">
		<h1 class="font-semibold !text-2xl">
			{#if sent}
				Password Reset Email Sent!
			{:else}
				Reset Password
			{/if}
		</h1>
		<i class="fa-solid fa-unlock-alt mx-1 text-surface-600-300-token text-2xl" />
	</div>

	{#if sent}
		<blockquote class="blockquote opacity-50">{email}</blockquote>
		<div>If this email exists, a password reset link appear in your inbox.</div>
		<div>
			Didn't get the email?
			<button class="btn variant-filled-primary btn-sm ml-2" disabled={!!timer}>
				{#if timer} {timer} {:else} Resend Email {/if}
			</button>
		</div>
	{:else}
		<label>
			<div class="mb-1">Your email</div>
			<input
				class="input"
				type="email"
				name="email"
				placeholder="email"
				bind:value={email}
				required
			/>
		</label>

		{#if errorMessage}
			<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
				<i class="fa-solid fa-triangle-exclamation" />
				{errorMessage}
			</div>
		{/if}

		<button class="btn variant-filled-primary mt-2">Reset Password</button>
	{/if}
</form>
