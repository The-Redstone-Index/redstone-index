<script lang="ts">
	import BuildList from '$lib/BuildList.svelte';
	import SchematicList from '$lib/SchematicList.svelte';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Avatar, FileButton, Tab, TabGroup, Toast, toastStore } from '@skeletonlabs/skeleton';

	const t: ToastSettings = {
		message: 'Click <b>Publish</b> on a Schematic to publish a New Build!',
		background: 'variant-filled-primary'
	};

	let tab = 0;
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
		<a class="btn variant-filled-primary" href="/builds/new">Post New Build</a>
		or
		<FileButton name="upload-schematic-button" on:change={() => (tab = 1)} accept=".nbt">
			Upload Schematic
		</FileButton>
	</div>

	<TabGroup>
		<Tab bind:group={tab} name="builds" value={0}>Builds (5)</Tab>
		<Tab bind:group={tab} name="schematics" value={1}>Schematics (54)</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tab === 0}
				<BuildList />
			{:else if tab === 1}
				<SchematicList />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>

<Toast />
