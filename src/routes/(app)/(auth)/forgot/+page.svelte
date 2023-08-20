<script lang="ts">
	import BigRedstoneLogo from '$lib/BigRedstoneLogo.svelte';
</script>

<svelte:head>
	<title>Forgot Password - Redstone Index</title>
</svelte:head>

<section class="grid place-items-center min-h-[800px] h-[calc(100vh-300px)]">
	<div class="flex flex-col gap-16">
		<BigRedstoneLogo />

		<form class="card p-7 flex flex-col gap-6 md:w-96" on:submit|preventDefault={() => {}}>
			<h1 class="!text-2xl font-semibold">Reset Password</h1>

			<label>
				<div class="mb-1">Your email</div>
				<input class="input" type="email" name="email" placeholder="email" />
			</label>

			<button class="btn variant-filled-primary">Reset Password</button>
		</form>
	</div>
</section>
