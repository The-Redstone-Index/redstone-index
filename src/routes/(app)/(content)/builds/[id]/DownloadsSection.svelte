<script lang="ts">
	import DownloadSchematicsTable from './DownloadSchematicsTable.svelte';

	export let build: BuildDetails;
</script>

<section id="#downloads" class="flex flex-col gap-4">
	<div class="font-semibold">Main Schematic</div>
	<DownloadSchematicsTable schematics={[build.schematic]} />

	<div class="font-semibold">Extra</div>
	<DownloadSchematicsTable schematics={build.extraSchematics} />
</section>
