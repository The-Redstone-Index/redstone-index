<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	$: ({ supabase } = data);

	let email = '';
	let password = '';
	let errorMessage = '';

	async function onSubmit() {
		const result = await supabase.auth.signInWithPassword({ email, password });
		if (result.error) {
			errorMessage = result.error.message;
		} else {
			goto('/', { replaceState: true });
		}
	}
</script>

<svelte:head>
	<title>Sign In - The Redstone Index</title>
	<meta
		name="description"
		content="Welcome back! Sign in to The Redstone Index and explore incredible Minecraft redstone creations."
	/>
</svelte:head>

<form class="card p-7 flex flex-col gap-5 w-full max-w-lg" on:submit|preventDefault={onSubmit}>
	<div class="flex justify-between">
		<h1 class="font-semibold !text-2xl">Sign in</h1>
		<i class="fa-solid fa-lock mx-1 text-surface-600-300-token text-2xl" />
	</div>

	<label>
		<label for="email" class="mb-1">Your email</label>
		<input
			class="input"
			type="email"
			name="email"
			id="email"
			placeholder="email"
			required
			bind:value={email}
		/>
	</label>

	<label>
		<label for="password" class="mb-1">Your password</label>
		<input
			class="input"
			type="password"
			name="password"
			id="password"
			placeholder="password"
			required
			bind:value={password}
		/>
	</label>

	<div class="flex justify-end">
		<a href="/forgot" class="anchor">Forgot password?</a>
	</div>

	{#if errorMessage}
		<div class="text-error-700 font-semibold text-center flex gap-2 justify-center items-center">
			<i class="fa-solid fa-triangle-exclamation" />
			{errorMessage}
		</div>
	{/if}

	<button class="btn variant-filled-primary">Sign In</button>

	<div>
		<span>Don't have an account yet?</span>
		<a href="/signup" class="anchor">Sign up</a>
	</div>
</form>
