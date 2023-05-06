<script lang="ts">
	import BuildViewer from '$lib/build-viewer/BuildViewer.svelte';
	import { onMount } from 'svelte';

	let schemaData: ArrayBuffer;
	onMount(async () => {
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

<div class="p-5 h-full w-full">
	{#if schemaData}
		<BuildViewer {schemaData} />
	{/if}
</div>
