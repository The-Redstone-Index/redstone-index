<script lang="ts">
	import { marked } from 'marked';
	import tos from './tos.md?raw';
</script>

<svelte:head>
	<title>Terms of Service - The Redstone Index</title>
	<meta
		name="description"
		content="Explore The Redstone Index's Terms of Service. Read our guidelines, policies, and user agreements for using our platform. Stay informed about your rights and responsibilities."
	/>
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<section class="prose">
		{@html marked(tos, { gfm: true })}
	</section>
</div>
