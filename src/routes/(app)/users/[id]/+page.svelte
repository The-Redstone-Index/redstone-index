<script lang="ts">
	import { page } from '$app/stores';
	import BuildList from '$lib/builds/BuildList.svelte';
	import SchematicList from '$lib/schematics/SchematicList.svelte';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Avatar, Tab, TabGroup, Toast, toastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	export let data;
	$: ({ profile } = data);

	const t: ToastSettings = {
		message: `
		<div class="flex items-center gap-1">
			<i class="fa-solid fa-hammer p-2"></i>
			Upload a Schematic and then click
			<b>Publish</b> to submit a New Build!
		</div>`,
		background: 'variant-filled-primary',
		timeout: 10_000
	};

	let tab = 0;
	let schematicTabHighlight = false;
	$: if (schematicTabHighlight) setTimeout(() => (schematicTabHighlight = false), 1500);

	onMount(() => {
		if ($page.url.hash == '#schematics') {
			tab = 1;
			schematicTabHighlight = true;
		}
	});
</script>

<svelte:head>
	<title>Profile - Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4">
	<div class="flex mb-5 items-center gap-5">
		<Avatar
			initials={profile?.username}
			src={profile?.avatar_url || undefined}
			width="w-24"
			cursor="cursor-pointer"
		/>
		<h1>{profile?.username}</h1>
		<a href="/settings">
			<i class="fa-solid fa-gear" />
			Profile Settings
		</a>
	</div>

	<div class="mb-5 flex gap-3 justify-end items-center">
		<a href="/schematics/new" on:change={() => (tab = 1)} class="btn variant-filled">
			Upload Schematic
		</a>
		or
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				tab = 1;
				schematicTabHighlight = true;
				toastStore.trigger(t);
			}}
		>
			Submit New Build
		</button>
	</div>

	<!-- Tabs -->
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
	</TabGroup>
</div>

<!-- Tab Panels --->
<div class="mx-auto max-w-[1800px]">
	{#if tab === 0}
		<BuildList />
	{:else if tab === 1}
		<SchematicList />
	{/if}
</div>

<Toast />
