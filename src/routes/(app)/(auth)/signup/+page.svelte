<script lang="ts">
	import BigRedstoneLogo from '$lib/BigRedstoneLogo.svelte';
</script>

<svelte:head>
	<title>Sign Up - Redstone Index</title>
</svelte:head>

<section class="grid place-items-center min-h-[1000px] h-[calc(100vh-300px)]">
	<div class="flex flex-col gap-12">
		<BigRedstoneLogo />

		<form class="card p-7 flex flex-col gap-5 md:w-96" on:submit|preventDefault={() => {}}>
			<h1 class="!text-2xl font-semibold">New Account</h1>

			<label>
				<div class="mb-1">Email</div>
				<input class="input" type="email" name="email" placeholder="email" />
			</label>

			<label>
				<div class="mb-1">Username</div>
				<input class="input" type="text" name="username" placeholder="username" />
			</label>

			<label>
				<div class="mb-1">Password</div>
				<input class="input" type="password" name="password" placeholder="password" />
			</label>

			<button class="btn variant-filled-primary">Sign Up</button>
		</form>
	</div>
</section>
