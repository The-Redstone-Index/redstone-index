<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import UserRoleChip from '$lib/chips/UserRoleChip.svelte';
	import SpecificationsTable from '$lib/inputs/SpecificationsTable.svelte';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { getRoleShortName, isModeratorOrAdmin } from '$lib/utils';
	import { Avatar, Tab, TabGroup, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import AssetViewerSection from './AssetViewerSection.svelte';
	import BuildEllipsesMenu from './BuildEllipsesMenu.svelte';
	import CommentsSection from './CommentsSection.svelte';
	import SummarySection from './SummarySection.svelte';
	export let data;

	let { supabase, build, userLiked, userCommented, user, session, highlightedCommentId } = data;
	$: ({ supabase, build, userLiked, userCommented, user, session, highlightedCommentId } = data);

	// For when the top comment button is clicked
	let commentsSectionTabHighlight = false;
	$: if (commentsSectionTabHighlight) setTimeout(() => (commentsSectionTabHighlight = false), 1500);

	// Tab management
	let tab = '#summary';

	// Remove the highlighted comment when changing tab
	// (so you can still click notification link which switches your tab and scrolls the page)
	function removeHighlightedComment() {
		goto('?');
	}

	// Ellipses menu
	let buildEllipsesMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'buildEllipsesMenuPopup'
	};

	// For scrolling down the page
	let tabSectionEl: HTMLElement;

	$: if (browser && tabSectionEl) {
		setTimeout(() => {
			if (highlightedCommentId) {
				selectAndScrollToTab('#comments');
			} else if ($page.url.hash) {
				selectAndScrollToTab($page.url.hash);
			}
		}, 1);
	}

	async function toggleLike() {
		if (!user) return goto('/signin');
		if (userLiked) {
			const resp = await supabase
				.from('build_likes')
				.delete()
				.eq('build_id', build.id)
				.eq('user_id', user.id);
			if (resp.error) throw resp.error;
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

{#if user}
	<BuildEllipsesMenu {build} selfUser={user} target={buildEllipsesMenuPopupSettings.target} />
{/if}

<div class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl">
	<!-- Build Name -->
	<div class="flex justify-between gap-2">
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
		{#if isModeratorOrAdmin(session)}
			<div>
				<button
					class="btn-icon hover:variant-soft h-fit"
					use:popup={buildEllipsesMenuPopupSettings}
				>
					<i class="fa-solid fa-ellipsis-vertical" />
				</button>
			</div>
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
			{#if build.author.role !== 'authenticated'}
				<UserRoleChip user={build.author} compact />
			{/if}
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
			{#key userCommented}
				<button
					on:click={() => selectAndScrollToTab('#comments')}
					class="btn variant-soft-surface gap-3"
					class:!variant-soft-primary={userCommented}
				>
					{#if userCommented}
						<i class="fas fa-comment" />
					{:else}
						<i class="far fa-comment" />
					{/if}
					{build.comments_count}
				</button>
			{/key}
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
			<Tab bind:group={tab} name="summary" value={'#summary'} on:click={removeHighlightedComment}>
				Summary
			</Tab>
			<Tab
				bind:group={tab}
				name="specifications"
				value={'#specifications'}
				on:click={removeHighlightedComment}
			>
				Specifications
			</Tab>
			<Tab
				bind:group={tab}
				name="downloads"
				value={'#downloads'}
				on:click={removeHighlightedComment}
			>
				Downloads
			</Tab>
			<Tab bind:group={tab} name="comments" labelledby="comments" value={'#comments'}>
				<div
					class:animate-bounce={commentsSectionTabHighlight}
					class:text-primary-500={commentsSectionTabHighlight}
					class="transition-colors"
				>
					Comments ({build.comments_count})
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
					<CommentsSection
						buildId={build.id}
						userId={user?.id}
						{highlightedCommentId}
						selfUser={user}
						on:commented={() => {
							userCommented = true;
							build.comments_count += 1;
						}}
					/>
				{/if}
			</div>
		</TabGroup>
	</div>
</div>
