<script lang="ts">
	import { marked } from 'marked';
	import feedback from './feedback.md?raw';
</script>

<svelte:head>
	<title>Feedback - The Redstone Index</title>
	<meta
		name="description"
		content="About the Redstone Index platform. Explore, share, and discover Redstone builds."
	/>
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<section class="prose">
		{@html marked(feedback, { gfm: true })}
	</section>
</div>
