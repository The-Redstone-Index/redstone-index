<script lang="ts">
	import GlowingRedstoneLogo from '$lib/common/GlowingRedstoneLogo.svelte';
	import pjson from '../../../package.json?raw';
	const { version } = JSON.parse(pjson);

	const navigationLinkGroups: {
		name: string;
		links: { name: string; href: string; icon?: string }[];
	}[] = [
		{
			name: 'Navigation',
			links: [
				{ name: 'Home', href: '/' },
				{ name: 'About', href: '/about' }
			]
		},
		{
			name: 'Content',
			links: [
				{ name: 'Search Builds', href: '/search', icon: 'fas fa-cube h-3.5' },
				{ name: 'Users', href: '/users', icon: 'fas fa-user h-3.5' },
				{ name: 'Tags', href: '/tags', icon: 'fas fa-tag h-3.5' },
				{ name: 'Specifications', href: '/specifications', icon: 'fas fa-sliders h-3.5' }
			]
		},
		{
			name: 'Resources',
			links: [
				{ name: 'Documentation', href: '/documentation' },
				{ name: 'Insights', href: '/insights' }
			]
		},
		{
			name: 'Support',
			links: [
				{ name: 'Terms & Conditions', href: '/terms-of-service' },
				{ name: 'Feedback', href: '/feedback' },
				{ name: 'Donate', href: '/donate' }
			]
		}
	];

	const externalIconLinks = [
		// { icon: 'fa-brands fa-twitter', href: 'https://twitter.com' },
		// { icon: 'fa-brands fa-discord', href: 'https://discord.com' },
		{ icon: 'fa-brands fa-github', href: 'https://github.com' }
	];
</script>

<footer class="bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-screen-xl p-6 py-4 lg:py-5">
		<div class="flex flex-col lg:flex-row justify-evenly gap-5">
			<div class="my-1 flex justify-normal sm:justify-center">
				<a href="/" class="flex gap-3">
					<GlowingRedstoneLogo pulse size="sm" />
					<div class="flex flex-col">
						<div class="self-center text-md uppercase font-bold whitespace-nowrap opacity-90">
							The Redstone Index
						</div>
						<div class="text-sm text-gray-500/40">{version}</div>
					</div>
				</a>
			</div>
			<div class="grid grid-cols-2 gap-6 sm:gap-4 sm:grid-cols-4">
				{#each navigationLinkGroups as group}
					<div>
						<h2 class="mb-5 text-sm font-semibold uppercase">
							{group.name}
						</h2>
						<ul class="text-gray-500 dark:text-gray-400 font-medium">
							{#each group.links as link}
								<li class="mb-3">
									<a href={link.href} class="hover:underline flex gap-1.5 items-center">
										{#if link?.icon}
											<i class={link.icon} />
										{/if}
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
		<hr class="my-3 border-gray-200 sm:mx-auto dark:border-gray-700" />
		<div class="sm:flex sm:items-center sm:justify-between px-2">
			<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
				© 2023 <a href="/" class="!no-underline hover:!underline">The Redstone Index</a>
				<span aria-hidden="true">&middot;</span>
				All Rights Reserved.
			</span>
			<div class="flex mt-4 sm:justify-center sm:mt-0 gap-5">
				{#each externalIconLinks as link}
					<a
						href={link.href}
						target="_blank"
						class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
					>
						<i class={link.icon} />
						<span class="sr-only">Facebook page</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
