<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import docs from './docs.md?raw';

	onMount(() => {});
</script>

<svelte:head>
	<title>API Documentation - The Redstone Index</title>
	<meta name="description" content="API documentation for The Redstone Index." />
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<section class="prose">
		{@html marked(docs, { gfm: true })}
	</section>
</div>
