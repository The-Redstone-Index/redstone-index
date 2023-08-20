<script lang="ts">
	import BigRedstoneLogo from '$lib/BigRedstoneLogo.svelte';
</script>

<svelte:head>
	<title>Sign In - Redstone Index</title>
</svelte:head>

<section class="grid place-items-center min-h-[800px] h-[calc(100vh-300px)]">
	<div class="flex flex-col gap-12">
		<BigRedstoneLogo />

		<div class="text-redstone font-semibold text-5xl">The Redstone Index</div>

		<form class="card p-7 flex flex-col gap-5" on:submit|preventDefault={() => {}}>
			<h1 class="!text-2xl font-semibold">Sign in</h1>

			<label>
				<div class="mb-1">Your email</div>
				<input class="input" type="email" name="email" placeholder="email" />
			</label>

			<label>
				<div class="mb-1">Your password</div>
				<input class="input" type="password" name="password" placeholder="password" />
			</label>

			<div class="flex justify-end">
				<a href="/forgot" class="!no-underline">Forgot password?</a>
			</div>

			<button class="btn variant-filled-primary">Sign In</button>

			<div>
				<span>Don't have an account yet?</span>
				<a href="/signup" class="!no-underline">Sign up</a>
			</div>
		</form>
	</div>
</section>
