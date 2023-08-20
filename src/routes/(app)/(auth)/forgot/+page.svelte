<script lang="ts">
	export let data;
	$: ({ supabase } = data);

	let email = '';
	let errorMessage = '';
	let sent = false;

	async function onSubmit() {
		const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: origin });
		if (result.error) {
			errorMessage = result.error.message;
		} else {
			sent = true;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password - Redstone Index</title>
</svelte:head>

<form class="card p-7 flex flex-col gap-5 w-full max-w-md" on:submit|preventDefault={onSubmit}>
	<div class="flex justify-between">
		<h1 class="font-semibold !text-2xl">Reset Password</h1>
		<i class="fa-solid fa-unlock-alt mx-1 text-surface-600-300-token text-2xl" />
	</div>

	{#if sent}
		<div>Password Reset Email Sent!</div>
		<div>If this email exists, a password reset link appear in your inbox.</div>
		<div>
			Please check your emails, and then <a href="/signin" class="!no-underline">Sign In.</a>
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
