<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
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

	let quickStats = [
		{ name: 'Type', value: 'Module', icon: 'fa-cube' },
		{ name: 'Size', value: '3x5x3', icon: 'fa-up-right-and-down-left-from-center' },
		{ name: 'Likes', value: '123', icon: 'fa-thumbs-up' },
		{ name: 'Comments', value: '23', icon: 'fa-comment' },
		{ name: 'Files', value: '5', icon: 'fa-file-lines' }
	];
</script>

<svelte:head>
	<title>The Redstone Index - {details.name}</title>
</svelte:head>

<div class="container mx-auto mb-10 flex flex-col gap-5 p-1">
	<!-- User + Build Name -->
	<div class="flex items-center p-3">
		<div class="group flex max-w-[10em] flex-shrink items-center gap-4">
			<a href={'/user/' + details.author.username} class="rounded-full p-3">
				<Avatar src={details.author.avatarSrc} class="h-14 w-14">
					{details.author.username[0].toLocaleUpperCase()}
				</Avatar>
			</a>
		</div>
		<div>
			<h1 class="ml-2 font-bold leading-none tracking-tight text-gray-900 dark:text-white">
				{details.name}
			</h1>
			<div class="mt-1 ml-2 w-64 truncate text-gray-500 dark:text-gray-300">
				By <a href={'/user/' + details.author.username} class="text-blue-500 underline"
					>{details.author.username}</a
				>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 md:flex-row">
		<!-- Quick Stats/Details -->
		<div
			class="flex md:w-96 gap-4 text-gray-600 dark:text-gray-300 md:order-1 md:flex-col overflow-auto"
		>
			{#each quickStats as stat}
				<div class="card p-2 px-4">
					<div class="flex flex-col items-center gap-3 md:flex-row">
						<i class="fa-solid {stat.icon} row-span-2 mr-1 text-2xl text-gray-500 md:text-4xl" />
						<div>
							<div class="text-xl">{stat.value}</div>
							<div class="font-thin">{stat.name}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Image -->
		<img
			src={details.pictures[viewerItem]}
			class="aspect-square w-full rounded-lg bg-gray-500 sm:aspect-video md:h-[480px]"
			alt=""
		/>

		<!-- Image Selector -->
		<div class="flex flex-nowrap gap-1 overflow-auto p-1 md:-order-1 md:flex-col md:h-[480px]">
			{#each details.pictures as pic, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<img
					src={pic}
					class="aspect-video w-36 md:w-56 cursor-pointer select-none rounded-xl bg-gray-500 outline-primary-600 outline-2"
					class:outline={i === viewerItem}
					on:click={() => (viewerItem = i)}
					alt=""
				/>
			{/each}
		</div>
	</div>

	<!-- Description -->
	<section class="card p-5">
		<h3 class="mb-5">Description</h3>
		<div>
			<p>{details.description}</p>
		</div>
	</section>

	<!-- Specifications -->
	<section class="card p-5">
		<h2 class="mb-5">Specifications</h2>
		<div class="table-container">
			<table class="table table-hover">
				<thead class="text-xs uppercase">
					<th>Item</th>
					<th>Value</th>
				</thead>
				<tbody>
					{#each details.stats as stat}
						<tr>
							<td>{stat.item}</td>
							<td>{stat.value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<div class="flex flex-col gap-5 md:flex-row">
		<!-- Minecraft Versions -->
		<section class="flex-grow card p-5">
			<h2 class="mb-5">Minecraft Version Compatability</h2>
			<div class="flex gap-3">
				{#each details.versions as version}
					<div
						class="chip variant-filled-primary"
						class:text-red-500={version.toLowerCase().includes('breaks')}
					>
						{version}
					</div>
				{/each}
			</div>
		</section>

		<!-- Tags -->
		<section class="flex-grow card p-5">
			<h2 class="mb-5">Tags</h2>
			<div class="flex gap-3">
				{#each details.tags as tag}
					<div class="chip variant-filled-primary">
						<i class="fa-solid fa-hashtag text-gray-800 dark:text-gray-100" />
						{tag}
					</div>
				{/each}
			</div>
		</section>
	</div>

	<!-- Build Artifacts -->
	<!-- TODO -->
	<section class="card p-5">
		<h2 class="pb-5">Files</h2>
		<div>
			<p>...</p>
		</div>
	</section>

	<!-- Comments Section -->
	<!-- TODO -->
	<section class="card p-5">
		<h2 class="pb-5">Comments</h2>
		<div>
			<p>...</p>
		</div>
	</section>
</div>

<style lang="postcss">
	.section {
		@apply rounded-3xl bg-surface-50 p-5 outline outline-2 outline-surface-200;
	}
	:global(.dark) .section {
		@apply bg-surface-900 outline-surface-700;
	}
</style>
