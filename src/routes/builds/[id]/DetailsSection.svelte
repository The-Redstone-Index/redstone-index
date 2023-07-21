<script lang="ts">
	import SpecsTableEditor from '$lib/SpecsTableEditor.svelte';

	export let stats: Array<{ item: string; value: string }>;
	export let editing: Boolean;
</script>

<section>
	<div>
		{#if editing}
			<SpecsTableEditor specifications={stats} />
		{:else}
			<table class="table table-hover">
				<thead class="text-xs uppercase text-left">
					<th>Item</th>
					<th>Value</th>
				</thead>
				<tbody>
					{#each stats as stat}
						<tr>
							<td class="table-cell-fit">{stat.item}</td>
							<td>{stat.value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</section>
