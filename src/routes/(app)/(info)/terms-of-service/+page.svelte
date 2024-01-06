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
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Back to Home
	</a>
	<section class="prose">
		{@html marked(tos, { gfm: true })}
	</section>
</div>
