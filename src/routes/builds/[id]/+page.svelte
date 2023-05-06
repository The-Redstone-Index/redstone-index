<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let details = {
		id: 0,
		name: 'Compact Instant 0-Tick 2 Wide Tileable Binary Adder',
		description: `It is indeed a very cool build. It can do something.`,
		type: 'Module',
		imgSrc: `https://picsum.photos/300/500?i=${Math.random()}`,
		tags: ['wireless redstone', 'iron farm', '0-tick pulse'],
		author: {
			username: 'plasmatech8',
			avatarSrc: `https://i.pravatar.cc/300?${Math.random()}`
		},
		pictures: [...Array(20)].map(() => `https://picsum.photos/800/600?i=${Math.random()}`),
		stats: [
			{ item: 'Items per minute', value: 124 },
			{ item: 'Input delay', value: '5 game ticks' },
			{ item: 'Automation', value: 'Semi-automatic' },
			{ item: 'Iterations per minute', value: 5 },
			{ item: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
		],
		versions: ['1.16+', '1.17+', 'Breaks 1.19+']
	};
	let viewerItem = 0;

	let schematicTabHighlight = false;
	$: if (schematicTabHighlight) setTimeout(() => (schematicTabHighlight = false), 1500);

	let comments = [
		{
			message:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'John',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message:
				'Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'plasmatech8',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Rerum debitis atque id dolorum aliquid!',
			username: 'Superman',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. ',
			username: 'Arnold Schwarzenegger',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		}
	];

	let quickStats = [
		{ name: 'Type', value: 'Module', icon: 'fa-cube' },
		{ name: 'Size', value: '3x5x3', icon: 'fa-up-right-and-down-left-from-center' },
		{ name: 'Likes', value: '123', icon: 'fa-thumbs-up' },
		{ name: 'Comments', value: '23', icon: 'fa-comment' },
		{ name: 'Files', value: '5', icon: 'fa-file-lines' }
	];

	let tab = '#details';
	let tabSectionEl: HTMLElement;
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
	<!--Build Name -->
	<h1 class="font-bold leading-none tracking-tight text-gray-900 dark:text-white">
		{details.name}
	</h1>

	<!-- Author + Likes/Comments button -->
	<div class="flex justify-between items-center gap-3">
		<div class="flex items-center gap-3">
			<a href={'/user/' + details.author.username} class="">
				<Avatar width="w-12" rounded="rounded-full" src={details.author.avatarSrc} class="">
					{details.author.username[0].toLocaleUpperCase()}
				</Avatar>
			</a>

			<div class="w-64 truncate text-gray-500 dark:text-gray-300">
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
					schematicTabHighlight = true;
					tabSectionEl.scrollIntoView({ behavior: 'smooth' });
				}}
				class="btn variant-glass-primary gap-3"
			>
				<i class="far fa-comment" />
				3
			</button>
		</div>
	</div>

	<!-- Schematic -->
	<section class="card p-5">
		<div class="flex gap-2 flex-col md:flex-row justify-center flex-nowrap h-[600px] ">
			<!-- Image -->
			<img
				src={details.pictures[viewerItem]}
				class="rounded-lg bg-gray-500 aspect-vide w-full h-full object-cover"
				alt=""
			/>

			<!-- Image Selector -->
			<div class="flex flex-nowrap gap-2 overflow-auto p-1 md:-order-1 md:flex-col">
				{#each details.pictures as pic, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img
						src={pic}
						class="aspect-square md:aspect-video md:w-32 w-20 cursor-pointer select-none rounded-xl bg-gray-500 outline-primary-600 outline-2"
						class:outline={i === viewerItem}
						on:click={() => (viewerItem = i)}
						alt=""
					/>
				{/each}
			</div>
		</div>
		<div class="p-4">
			<!-- Caption -->
			<div class="mb-3">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quia a eius itaque,
				labore, rerum possimus facere voluptatum, reprehenderit nulla ducimus aliquam ipsa autem
				nobis! Temporibus itaque quibusdam harum cupiditate.
			</div>
			<!-- Block list -->
			<div class="flex gap-3">
				<div>A x5</div>
				<div>B x3</div>
				<div>C x1</div>
				<div>D x3</div>
			</div>
		</div>
	</section>

	<div bind:this={tabSectionEl}>
		<TabGroup>
			<Tab bind:group={tab} name="details" value={'#details'}>Details</Tab>
			<Tab bind:group={tab} name="specifications" value={'#specifications'}>Specifications</Tab>
			<Tab bind:group={tab} name="downloads" value={'#downloads'}>Downloads</Tab>
			<Tab bind:group={tab} name="comments" labelledby="comments" value={'#comments'}>
				<div
					class:animate-bounce={schematicTabHighlight}
					class:text-primary-500={schematicTabHighlight}
					class="transition-colors"
				>
					Comments (123)
				</div>
			</Tab>
			<!-- Tab Panels --->
			<div class="flex flex-col gap-5" slot="panel">
				{#if tab === '#details'}
					<!-- Description -->
					<section class="card p-5">
						<h2 class="mb-5">Description</h2>
						<div>
							<p>{details.description}</p>
						</div>
					</section>

					<!-- Minecraft Versions -->
					<section class="flex-[50%] card p-5">
						<h2 class="mb-5">Minecraft Version Compatability</h2>
						<div class="flex gap-3">
							{#each details.versions as version}
								<div
									class="chip variant-soft-success"
									class:variant-soft-error={version.toLowerCase().includes('breaks')}
								>
									{version}
								</div>
							{/each}
						</div>
					</section>

					<!-- Tags -->
					<section class="flex-[50%] card p-5">
						<h2 class="mb-5">Tags</h2>
						<div class="flex gap-3">
							{#each details.tags as tag}
								<div class="chip variant-soft-primary">
									<i class="fa-solid fa-hashtag" />
									{tag}
								</div>
							{/each}
						</div>
					</section>
				{:else if tab === '#specifications'}
					<!-- Specifications -->
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
