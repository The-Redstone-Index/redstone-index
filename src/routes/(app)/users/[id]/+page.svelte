<script lang="ts">
	import { page } from '$app/stores';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import BuildCard from '$lib/display/BuildCard.svelte';
	import SchematicCard from '$lib/display/SchematicCard.svelte';
	import { getResources } from '$lib/minecraft-rendering/mcmetaAPI.js';
	import { getAvatarUrl } from '$lib/utils.js';
	import { Avatar, Tab, TabGroup, getToastStore } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let data;
	let { supabase, profile } = data;
	$: ({ supabase, profile } = data);

	const toastStore = getToastStore();

	let tab = 0;
	let schematicTabHighlight = false;
	$: if (schematicTabHighlight) setTimeout(() => (schematicTabHighlight = false), 1500);
	let avatarUrl: string | undefined;
	let resources: Resources | undefined;

	onMount(async () => {
		if ($page.url.hash == '#schematics') {
			tab = 1;
			schematicTabHighlight = true;
		}
		avatarUrl = getAvatarUrl(supabase, profile.avatar_path);
		resources = await getResources();
	});

	function onClickSubmitNewBuild() {
		tab = 1;
		schematicTabHighlight = true;
		toastStore.trigger({
			message: `<i class="fa-solid fa-hammer ml-2 mr-1"></i>
				Upload a Schematic and then click <span class="btn btn-sm variant-filled-primary"><b>Publish</b></span> to submit a New Build!`,
			background: 'variant-filled',
			timeout: 10_000
		});
	}
</script>

<svelte:head>
	<title>{profile.username}'s Redstone Creations - The Redstone Index</title>
	<meta
		name="description"
		content="Explore {profile.username}'s Redstone creations on The Redstone Index. View their bio, builds, and schematics."
	/>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4">
	<div class="flex items-center gap-5">
		<Avatar initials={profile.username} src={avatarUrl} width="w-24" cursor="cursor-pointer" />
		<h1 class="h1">{profile.username}</h1>
		<a href="/settings" class="anchor">
			<i class="fa-solid fa-gear" />
			My Settings
		</a>
	</div>

	<div
		class="whitespace-pre max-h-64 overflow-auto mx-10 my-5 border-l border-surface-200-700-token px-5"
	>
		{profile.bio}
	</div>

	<div class="mb-5 flex gap-3 justify-end items-center">
		<a href="/schematics/new" on:change={() => (tab = 1)} class="btn variant-filled">
			Upload Schematic
		</a>
		or
		<button class="btn variant-filled-primary" on:click={onClickSubmitNewBuild}>
			Submit New Build
		</button>
	</div>

	<!-- Tabs -->
	<TabGroup>
		<Tab bind:group={tab} name="builds" value={0}>Builds ({profile.builds.length})</Tab>
		<Tab bind:group={tab} name="schematics" value={1}>
			<div
				class:animate-bounce={schematicTabHighlight}
				class:text-primary-500={schematicTabHighlight}
				class="transition-colors"
			>
				Schematics ({profile.schematics.length})
			</div>
		</Tab>
	</TabGroup>
</div>

<!-- Tab Panels --->
<div class="mx-auto max-w-[1800px]">
	<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap justify-center">
		{#if !resources}
			<div class="h-96">
				<LoadingSpinnerArea />
			</div>
		{:else if tab === 0}
			{#each profile.builds as build}
				<BuildCard {resources} />
			{:else}
				<div class="grid place-items-center h-60">No builds!</div>
			{/each}
		{:else if tab === 1}
			{#each profile.schematics as schematic}
				<SchematicCard
					{supabase}
					{schematic}
					{resources}
					to={`/schematics/${schematic.id}?blocklist&inputcontrols&elevationslider`}
				>
					<div class="flex justify-end w-full p-3">
						{#if !schematic.builds?.length}
							<a
								href="/builds/0"
								class="btn btn-sm variant-filled-primary opacity-70 hover:opacity-100"
							>
								Publish
							</a>
						{:else}
							<a
								href="/builds/0"
								class="btn btn-sm variant-filled-surface opacity-70 hover:opacity-100"
							>
								Already Published
							</a>
						{/if}
					</div>
				</SchematicCard>
			{:else}
				<div class="grid place-items-center h-60">No schematics!</div>
			{/each}
		{/if}
	</div>
</div>
