<script lang="ts">
	import { marked } from 'marked';
	import contact from './contact.md?raw';
</script>

<svelte:head>
	<title>Contact - The Redstone Index</title>
	<meta name="description" content="Contact Us at the Redstone Index platform." />
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<section class="prose">
		{@html marked(contact, { gfm: true })}
	</section>
</div>
