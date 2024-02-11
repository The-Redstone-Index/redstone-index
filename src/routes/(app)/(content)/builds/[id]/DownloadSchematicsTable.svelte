<script lang="ts">
	export let schematics: Tables<'schematics'>[];
</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>ID</th>
				<th>Created At</th>
				<th>View</th>
				<th>Download</th>
			</tr>
		</thead>
		<tbody>
			{#each schematics as schematic}
				{@const downloadLink = `/api/schematics/${schematic.id}/download`}
				{@const viewerLink = `/schematics/${schematic.id}?blocklist&inputcontrols&elevationslider`}
				<tr>
					<td>#{schematic.id}</td>
					<td>{new Date(schematic.created_at).toLocaleString()}</td>
					<td>
						<a class="btn variant-filled-primary gap-2 btn-sm" href={viewerLink} target="_blank">
							<i class="fa-solid fa-up-right-from-square" />
							View
						</a>
					</td>
					<td>
						<a class="btn variant-filled-primary gap-2 btn-sm" href={downloadLink} target="_blank">
							<i class="fa-solid fa-file-arrow-down" />
							Download
						</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4">
						<div class="h-16 w-full opacity-50 grid place-items-center">None here</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
