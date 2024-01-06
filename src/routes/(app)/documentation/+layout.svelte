<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import json from 'highlight.js/lib/languages/json';
	import 'highlight.js/styles/github-dark.css';
	import { onMount } from 'svelte';

	hljs.registerLanguage('json', json);
	hljs.registerLanguage('bash', bash);

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<slot />
