<script lang="ts">
	import pjson from '../../../package.json?raw';
	const { version } = JSON.parse(pjson);
</script>

<footer class="bg-surface-100-800-token">
	<div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
		<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
			© 2023 <a href="/" class="!no-underline hover:!underline">The Redstone Index</a>
			<span aria-hidden="true">&middot;</span>
			All Rights Reserved.
		</span>
		<span class="text-sm text-gray-500">{version}</span>
		<ul
			class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0"
		>
			<li>
				<a href="/" class="mr-4 !no-underline hover:!underline md:mr-6">Home</a>
				<a href="/terms-of-service" class="mr-4 !no-underline hover:!underline md:mr-6">
					Terms of Service
				</a>
				<a href="/contact" class="mr-4 !no-underline hover:!underline md:mr-6">Contact Us</a>
			</li>
		</ul>
	</div>
</footer>
