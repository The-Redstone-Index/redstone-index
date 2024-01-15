<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SpecificationsTable from '$lib/inputs/SpecificationsTable.svelte';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { isModeratorOrAdmin } from '$lib/utils';
	import { Avatar, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import AssetViewerSection from './AssetViewerSection.svelte';
	import CommentsSection from './CommentsSection.svelte';
	import SummarySection from './SummarySection.svelte';
	export let data;

	let { supabase, build, userLiked, user, session } = data;
	$: ({ supabase, build, userLiked, user, session } = data);

	const dummyComments = [
		{
			message:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'John',
			avatar: `https://i.pravatar.cc/50?${Math.random()}`,
			time: new Date()
		},
		{
			message:
				'Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'plasmatech8',
			avatar: `https://i.pravatar.cc/50?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Rerum debitis atque id dolorum aliquid!',
			username: 'Superman',
			avatar: `https://i.pravatar.cc/50?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. ',
			username: 'Arnold Schwarzenegger',
			avatar: `https://i.pravatar.cc/50?${Math.random()}`,
			time: new Date()
		}
	];

	// For when the top comment button is clicked
	let commentsSectionTabHighlight = false;
	$: if (commentsSectionTabHighlight) setTimeout(() => (commentsSectionTabHighlight = false), 1500);

	// Tab management
	let tab = '#summary';

	// For scrolling down the page
	let tabSectionEl: HTMLElement;

	onMount(() => {
		if ($page.url.hash) {
			selectAndScrollToTab($page.url.hash);
		}
	});

	async function toggleLike() {
		if (!user) return goto('/signin');
		if (userLiked) {
			const resp = await supabase
				.from('build_likes')
				.delete()
				.eq('build_id', build.id)
				.eq('user_id', user.id);
			if (resp.error) throw resp.error;
			console.log(resp);
			userLiked = false;
			build.likes_count -= 1;
		} else {
			const resp = await supabase
				.from('build_likes')
				.insert({ build_id: build.id, user_id: user.id });
			if (resp.error) throw resp.error;
			userLiked = true;
			build.likes_count += 1;
		}
	}

	function selectAndScrollToTab(tabName: string) {
		tab = tabName;
		if (tabName === '#comments') commentsSectionTabHighlight = true;
		tabSectionEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>{build.title} - The Redstone Index</title>
	<meta
		name="description"
		content="View a Minecraft redstone build on The Redstone Index. Inspect its design, features and specifications."
	/>
</svelte:head>

<div class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl">
	<!-- Build Name -->
	<div class="flex items-center gap-5">
		<h1 class="font-bold leading-none tracking-tight text-gray-900 dark:text-white h2">
			{build.title}
		</h1>
		{#if build.user_id === user?.id || isModeratorOrAdmin(session)}
			<a href={`${$page.url.pathname}/edit`} class="anchor">
				<i class="fas fa-pencil no-underline" />
				<span>Edit</span>
			</a>
		{/if}
	</div>
	<!-- Author + Likes/Comments button -->
	<div class="flex justify-between items-center gap-3 flex-wrap mx-1">
		<div class="flex items-center gap-3">
			<a href="/users/0" class="">
				<Avatar
					width="w-12"
					rounded="rounded-full"
					src={getAvatarUrl(supabase, build.author.avatar_path)}
					initials={build.author.username.toLocaleUpperCase()}
				/>
			</a>

			<div class="max-w-xs truncate text-gray-500 dark:text-gray-300">
				By <a href={'/users/' + build.author.numeric_id} class="underline anchor">
					{build.author.username}
				</a>
			</div>
		</div>
		<div class="flex items-center gap-3">
			{#key userLiked}
				<button
					class="btn variant-soft-surface gap-3"
					class:!variant-soft-primary={userLiked}
					on:click={toggleLike}
				>
					{#if userLiked}
						<i class="fas fa-thumbs-up" />
					{:else}
						<i class="far fa-thumbs-up" />
					{/if}
					{build.likes_count}
				</button>
			{/key}
			<button
				on:click={() => selectAndScrollToTab('#comments')}
				class="btn variant-soft-surface gap-3"
				class:!variant-soft-primary={false}
			>
				<!-- TODO: userCommented -->
				{#if false}
					<i class="fas fa-comment" />
				{:else}
					<i class="far fa-comment" />
				{/if}
				3
			</button>
		</div>
	</div>

	<!-- Asset Viewer -->
	<AssetViewerSection
		{supabase}
		schematic={build.schematic}
		extraSchematics={build.extraSchematics}
		extraImagePaths={build.extra_images}
	/>

	<div bind:this={tabSectionEl} class="min-h-[600px]">
		<TabGroup>
			<Tab bind:group={tab} name="summary" value={'#summary'}>Summary</Tab>
			<Tab bind:group={tab} name="specifications" value={'#specifications'}>Specifications</Tab>
			<Tab bind:group={tab} name="downloads" value={'#downloads'}>Downloads</Tab>
			<Tab bind:group={tab} name="comments" labelledby="comments" value={'#comments'}>
				<div
					class:animate-bounce={commentsSectionTabHighlight}
					class:text-primary-500={commentsSectionTabHighlight}
					class="transition-colors"
				>
					Comments (123)
				</div>
			</Tab>
			<!-- Tab Panels --->
			<div class="flex flex-col gap-5 pt-2" slot="panel">
				{#if tab === '#summary'}
					<SummarySection
						description={build.description}
						tags={['ASD']}
						testedVersion={build.tested_in_version}
						workingVersion={build.works_in_version}
						breakingVersion={build.breaks_in_version}
					/>
				{:else if tab === '#specifications'}
					<SpecificationsTable specValues={build.specifications} readonly />
				{:else if tab === '#downloads'}
					(tab panel 3 contents)
				{:else if tab === '#comments'}
					<CommentsSection comments={dummyComments} />
				{/if}
			</div>
		</TabGroup>
	</div>
</div>
