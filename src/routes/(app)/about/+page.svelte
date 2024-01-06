<script lang="ts">
	import { marked } from 'marked';
	import about from './about.md?raw';
</script>

<svelte:head>
	<title>About Us - The Redstone Index</title>
	<meta
		name="description"
		content="About the Redstone Index platform. Explore, share, and discover Redstone builds."
	/>
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Back to Home
	</a>
	<section class="prose">
		{@html marked(about, { gfm: true })}
	</section>
	<div class="flex justify-center gap-3">
		<a href="/signin" class="btn variant-filled-primary gap-3">
			Sign In
			<i class="fa-solid fa-arrow-right-to-bracket" />
		</a>
		<a href="/signup" class="btn variant-filled-primary gap-3">
			Register Now
			<i class="fa-solid fa-user-plus" />
		</a>
	</div>
</div>
