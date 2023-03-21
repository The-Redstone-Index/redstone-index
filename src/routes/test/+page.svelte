<script lang="ts">
	import BuildViewer from '$lib/build-viewer/BuildViewer.svelte';
	import { onMount } from 'svelte';

	let schemaData: ArrayBuffer;
	onMount(async () => {
		schemaData = await fetch('/piston_trapdoor.nbt').then((r) => r.arrayBuffer());
	});
</script>

{#if schemaData}
	<BuildViewer {schemaData} />
{/if}
