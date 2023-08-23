<script lang="ts">
	import { goto } from '$app/navigation';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data;
	$: ({ supabase } = data);

	let email = '';
	let password = '';
	let username = '';
	let errorMessage = '';

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
			switch (result.error.message) {
				case 'duplicate key value violates unique constraint "profiles_username_key"':
					errorMessage = 'Sorry, this username is already taken. Please choose another.';
					break;
				case 'new row for relation "profiles" violates check constraint "username_length"':
					errorMessage = 'Username must be at least 3 characters long.';
					break;
				case 'new row for relation "profiles" violates check constraint "username_pattern"':
					errorMessage = 'Username can only contain letters, numbers, and underscores.';
					break;
				default:
					errorMessage = result.error.message;
			}
		} else {
			toastStore.trigger(signUpToast);
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

	{#if errorMessage}
		<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
			<i class="fa-solid fa-triangle-exclamation" />
			{errorMessage}
		</div>
	{/if}

	<button class="btn variant-filled-primary mt-2">Sign Up</button>
</form>