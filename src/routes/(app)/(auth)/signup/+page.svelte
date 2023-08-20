<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	$: ({ supabase } = data);

	let email = '';
	let password = '';
	let errorMessage = '';

	async function onSubmit() {
		const result = await supabase.auth.signUp({ email, password });
		if (result.error) {
			errorMessage = result.error.message;
		} else {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Sign Up - Redstone Index</title>
</svelte:head>

<form class="card p-7 flex flex-col gap-5 w-full max-w-lg" on:submit|preventDefault={onSubmit}>
	<div class="flex justify-between">
		<h1 class="font-semibold !text-2xl">New Account</h1>
		<i class="fa-solid fa-user-plus mx-1 text-surface-600-300-token text-2xl" />
	</div>

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

	{#if errorMessage}
		<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
			<i class="fa-solid fa-triangle-exclamation" />
			{errorMessage}
		</div>
	{/if}

	<button class="btn variant-filled-primary mt-2">Sign Up</button>
</form>
