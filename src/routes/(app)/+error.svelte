<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} Error - The Redstone Index</title>
	<meta name="description" content="Sorry! There was a problem." />
</svelte:head>

<section class="h-[calc(100vh-15rem)] grid place-items-center">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-sm text-center">
			<h1
				class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500"
			>
				{$page.status}
			</h1>
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{#if $page.status === 404}
					Something is missing...
				{:else}
					Something went wrong...
				{/if}
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				{$page?.error?.message ?? 'Error'}
			</p>
			<a href="/" class="btn variant-filled-primary my-4">Back to Homepage</a>
		</div>
	</div>
</section>
