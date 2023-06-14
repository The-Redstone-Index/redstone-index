<script lang="ts">
	import SchematicList from '$lib/SchematicList.svelte';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Avatar, FileButton, Tab, TabGroup, Toast, toastStore } from '@skeletonlabs/skeleton';

	const t: ToastSettings = {
		message: 'Click <b>Publish</b> on a Schematic to publish a New Build!',
		background: 'variant-filled-primary'
	};

	let tab = 0;
	let schematicTabHighlight = false;
	$: if (schematicTabHighlight) setTimeout(() => (schematicTabHighlight = false), 1500);
</script>

<svelte:head>
	<title>Profile - The Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4">
	<div class="flex mb-5 items-center gap-5">
		<Avatar width="w-24" src="https://i.pravatar.cc/" cursor="cursor-pointer" />
		<h1>plasmatech8</h1>
		<a href="/users/0/settings">Update profile</a>
	</div>

	<div class="mb-5 flex gap-3 justify-end items-center">
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				tab = 1;
				schematicTabHighlight = true;
				toastStore.trigger(t);
			}}
		>
			Post New Build
		</button>
		or
		<FileButton
			name="upload-schatic-button"
			on:change={() => {
				tab = 1;
				schematicTabHighlight = true;
			}}
		>
			Upload Schematic
		</FileButton>
	</div>

	<TabGroup>
		<Tab bind:group={tab} name="builds" value={0}>Builds (5)</Tab>
		<Tab bind:group={tab} name="schematics" value={1}>
			<div
				class:animate-bounce={schematicTabHighlight}
				class:text-primary-500={schematicTabHighlight}
				class="transition-colors"
			>
				Schematics (54)
			</div>
		</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tab === 0}
				Builds
			{:else if tab === 1}
				<SchematicList />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>

<Toast />
