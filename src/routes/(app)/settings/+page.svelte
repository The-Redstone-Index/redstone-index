<script lang="ts">
	import LoadingSpinnerArea from '$lib/LoadingSpinnerArea.svelte';
	import { Avatar, clipboard } from '@skeletonlabs/skeleton';

	export let data;
	$: ({ profile } = data);
</script>

<svelte:head>
	<title>User Settings - Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 mb-5">
	<h1>User Settings</h1>
</div>

<div class="container mx-auto flex flex-col gap-10">
	{#if profile}
		<div class="flex gap-5 items-center">
			<span>Avatar:</span>
			<Avatar
				width="w-52"
				src={profile.avatar_url || undefined}
				initials={profile.username}
				cursor="cursor-pointer"
			/>
			<button class="btn variant-filled-primary" disabled>Upload New Image</button>
			<button class="btn variant-soft-primary" use:clipboard={profile.api_token} disabled>
				Clear
			</button>
		</div>
		<div class="flex gap-5 items-center">
			<label for="username">Username</label>
			<input
				id="username"
				type="text"
				bind:value={profile.username}
				class="input max-w-lg"
				disabled
			/>
			<button class="btn variant-filled-primary" disabled>Update</button>
		</div>

		<div class="flex gap-5 items-center">
			<span>API Token</span>
			<input
				class="input max-w-lg"
				type="text"
				readonly
				use:clipboard={profile.api_token}
				bind:value={profile.api_token}
				disabled
				placeholder="No API token"
			/>
			<button class="btn variant-filled" use:clipboard={profile.api_token} disabled>Copy</button>
			<button class="btn variant-filled-primary" disabled>Re-Generate</button>
			<button class="btn variant-soft-primary" use:clipboard={profile.api_token} disabled>
				Clear
			</button>
		</div>

		<div class="flex gap-5 items-center">
			<div>Reset Password</div>
			<button class="btn variant-filled" disabled>Send Reset Password Link</button>
		</div>
	{:else}
		<div class="my-20">
			<LoadingSpinnerArea />
		</div>
	{/if}
</div>
