<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import AssetViewerSection from './AssetViewerSection.svelte';
	import SummarySection from './SummarySection.svelte';
	export let data;

	const details = data.details;
	const comments = data.comments;
	const quickStats = data.quickStats;

	// For when the top comment button is clicked
	let commentsSectionTabHighlight = false;
	$: if (commentsSectionTabHighlight) setTimeout(() => (commentsSectionTabHighlight = false), 1500);

	// Tab management
	let tab = '#summary';

	// For scrolling down the page
	let tabSectionEl: HTMLElement;

	// Comment section
	let newComment = '';
	let commentTextAreaEl: HTMLTextAreaElement;
	$: if (newComment && tab && commentTextAreaEl) {
		commentTextAreaEl.style.height = '';
		commentTextAreaEl.style.height = commentTextAreaEl.scrollHeight + 2 + 'px';
	}

	onMount(() => {
		if ($page.url.hash) {
			tab = $page.url.hash;
			tabSectionEl.scrollIntoView();
		}
	});
</script>

<svelte:head>
	<title>The Redstone Index - {details.name}</title>
</svelte:head>

<div class="container mx-auto mb-10 flex flex-col gap-5 p-3 pt-12 max-w-7xl">
	<!-- Build Name -->
	<h1 class="font-bold leading-none tracking-tight text-gray-900 dark:text-white">
		{details.name}
	</h1>

	<!-- Author + Likes/Comments button -->
	<div class="flex justify-between items-center gap-3 flex-wrap">
		<div class="flex items-center gap-3">
			<a href={'/user/' + details.author.username} class="">
				<Avatar width="w-12" rounded="rounded-full" src={details.author.avatarSrc} class="">
					{details.author.username[0].toLocaleUpperCase()}
				</Avatar>
			</a>

			<div class="max-w-xs truncate text-gray-500 dark:text-gray-300">
				By <a href={'/user/' + details.author.username} class="text-blue-500 underline">
					{details.author.username}
				</a>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<button class="btn variant-glass-primary gap-3">
				<i class="far fa-thumbs-up" />
				123
			</button>
			<button
				on:click={() => {
					tab = '#comments';
					commentsSectionTabHighlight = true;
					tabSectionEl.scrollIntoView({ behavior: 'smooth' });
				}}
				class="btn variant-glass-primary gap-3"
			>
				<i class="far fa-comment" />
				3
			</button>
		</div>
	</div>

	<!-- Asset Viewer -->
	<AssetViewerSection assets={details.pictures} />

	<div bind:this={tabSectionEl}>
		<TabGroup>
			<Tab bind:group={tab} name="summary" value={'#summary'}>Summary</Tab>
			<Tab bind:group={tab} name="details" value={'#details'}>Details</Tab>
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
			<div class="flex flex-col gap-5" slot="panel">
				{#if tab === '#summary'}
					<SummarySection {...details} />
				{:else if tab === '#details'}
					<!-- Details -->
					<section class="">
						<!--  class="table-containe outline outline-1 outline-surface-300 dark:outline-surface-600" -->
						<div>
							<table class="table table-hover">
								<thead class="text-xs uppercase text-left">
									<th>Item</th>
									<th>Value</th>
								</thead>
								<tbody>
									{#each details.stats as stat}
										<tr>
											<td class="table-cell-fit">{stat.item}</td>
											<td>{stat.value}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>
				{:else if tab === '#downloads'}
					(tab panel 3 contents)
				{:else if tab === '#comments'}
					<!-- Comments Section -->
					<section id="#comments" class="flex flex-col gap-5">
						<!-- Input -->
						<form class="flex gap-3 items-center">
							<textarea
								name="newComment"
								id="newComment"
								class="textarea resize-none"
								rows="3"
								placeholder="Write a comment..."
								bind:this={commentTextAreaEl}
								bind:value={newComment}
							/>
							<button class="btn-icon variant-filled-primary h-min aspect-square">
								<i class="fa-solid fa-paper-plane" />
							</button>
						</form>
						<!-- Comments -->
						<div id="comments" class="flex flex-col gap-8">
							{#each comments as comment}
								<div class="flex flex-col gap-2 group">
									<div class="flex gap-5 items-center">
										<Avatar width="w-8" rounded="rounded-full" src={comment.avatar} class="">
											{comment.username[0].toLocaleUpperCase()}
										</Avatar>
										<a
											href={`/user/${comment.username}`}
											class="font-bold text-sm truncate !text-current !no-underline hover:!underline"
										>
											{comment.username}
										</a>
										<div class="font-thin text-sm whitespace-nowrap">
											{comment.time.toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric'
											})}
										</div>
										<div class="flex-1 justify-end flex-grow flex invisible group-hover:visible">
											<button class="btn-icon">
												<i class="fa-solid fa-ellipsis-vertical" />
											</button>
										</div>
									</div>
									<div>
										{comment.message}
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</TabGroup>
	</div>
</div>
