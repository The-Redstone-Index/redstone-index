<script lang="ts">
	import { page } from '$app/stores';
	import { getAvatarUrl } from '$lib/api/storage';
	import BuildCard from '$lib/cards/BuildCard.svelte';
	import SchematicCard from '$lib/cards/SchematicCard.svelte';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import { minecraftStore } from '$lib/stores.js';
	import {
		Avatar,
		Tab,
		TabGroup,
		getToastStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import UserEllipsesMenu from './UserEllipsesMenu.svelte';

	export let data;
	let { supabase, profile, user } = data;
	$: ({ supabase, profile, user } = data);

	const toastStore = getToastStore();

	let tab = 0;
	let schematicTabHighlight = false;
	$: if (schematicTabHighlight) setTimeout(() => (schematicTabHighlight = false), 1500);
	let avatarUrl: string | undefined;

	let userEllipsesMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'userEllipsesMenuPopup'
	};

	onMount(async () => {
		if ($page.url.hash == '#schematics') {
			tab = 1;
			schematicTabHighlight = true;
		}
		avatarUrl = getAvatarUrl(supabase, profile.avatar_path);
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

{#if user}
	<UserEllipsesMenu target={userEllipsesMenuPopupSettings.target} {user} />
{/if}

<div class="container h-full mx-auto justify-center p-4">
	<div class="grid grid-cols-[3rem_auto_3rem]">
		<div />
		<div class="flex items-center flex-col md:flex-row gap-5">
			<Avatar initials={profile.username} src={avatarUrl} width="w-24" cursor="cursor-pointer" />
			<h1 class="h1">{profile.username}</h1>
			{#if profile.id === user?.id}
				<a href="/settings" class="anchor">
					<i class="fa-solid fa-gear" />
					My Settings
				</a>
			{/if}
		</div>
		<div class="flex md:items-center">
			<button class="btn-icon hover:variant-soft h-fit" use:popup={userEllipsesMenuPopupSettings}>
				<i class="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
	</div>

	<div
		class="whitespace-pre-wrap max-h-64 overflow-auto mx-10 my-5 border-l border-surface-200-700-token px-5"
	>
		{profile.bio}
	</div>
	{#if profile.id === user?.id}
		<div class="mb-5 flex gap-3 justify-end items-center">
			<a href="/schematics/new" on:change={() => (tab = 1)} class="btn variant-filled">
				Upload Schematic
			</a>
			or
			<button class="btn variant-filled-primary" on:click={onClickSubmitNewBuild}>
				Submit New Build
			</button>
		</div>
	{/if}

	<!-- Tabs -->
	<TabGroup>
		<Tab bind:group={tab} name="builds" value={0}>
			<i class="fas fa-cube" />
			Builds ({profile.builds.length})
		</Tab>
		<Tab bind:group={tab} name="schematics" value={1}>
			<div
				class:animate-bounce={schematicTabHighlight}
				class:text-primary-500={schematicTabHighlight}
				class="transition-colors"
			>
				<i class="fas fa-ruler-combined" />
				Schematics ({profile.schematics.length})
			</div>
		</Tab>
		<div class="mr-auto" />
		<Tab bind:group={tab} name="builds" value={2}>
			<i class="far fa-thumbs-up" />
			Likes ({profile.likedBuilds.length})
		</Tab>
	</TabGroup>
</div>

<!-- Tab Panels --->
<div class="mx-auto max-w-[1800px] min-h-[32rem]">
	<div class="gap-4 px-5 pb-12 pt-2 flex flex-wrap justify-center">
		{#if !$minecraftStore}
			<div class="h-96">
				<LoadingSpinnerArea />
			</div>
		{:else if tab === 0}
			{#each profile.builds as build}
				<BuildCard {build} to={`/builds/${build.id}`} />
			{:else}
				<div class="grid place-items-center h-60">No builds!</div>
			{/each}
		{:else if tab === 1}
			{#each profile.schematics as schematic}
				<SchematicCard
					{schematic}
					to={`/schematics/${schematic.id}?blocklist&inputcontrols&elevationslider`}
				>
					<div class="absolute top-0 right-0 p-3">
						{#if profile.id === user?.id && !schematic.build}
							<a
								href="/builds/{schematic.id}/edit"
								class="btn btn-sm variant-filled-primary opacity-70 hover:opacity-100"
							>
								Publish
							</a>
						{/if}
						{#if schematic.build}
							<a
								href="/builds/{schematic.build.id}"
								class="btn btn-sm variant-filled-surface opacity-70 hover:opacity-100"
							>
								Published in #{schematic.build.id}
							</a>
						{/if}
					</div>
					{#if schematic.references.length}
						<div class="absolute bottom-0 left-2 flex gap-1 text-xs text-white">
							<span class="opacity-70">Referenced in:</span>
							{#each schematic.references as refs}
								<a
									class="btn btn-sm h-4 w-6 variant-filled-surface opacity-70 hover:opacity-100 text-xs"
									href={`/builds/${refs.build_id}`}
								>
									#{refs.build_id}
								</a>
							{/each}
						</div>
					{/if}
				</SchematicCard>
			{:else}
				<div class="grid place-items-center h-60">No schematics!</div>
			{/each}
		{:else if tab === 2}
			{#each profile.likedBuilds as build}
				<BuildCard {build} to={`/builds/${build.id}`} />
			{:else}
				<div class="grid place-items-center h-60">No liked builds!</div>
			{/each}
		{/if}
	</div>
</div>
