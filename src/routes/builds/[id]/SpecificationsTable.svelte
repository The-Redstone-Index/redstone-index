<script lang="ts">
	export let stats: Array<{ item: string; value: string }>;
</script>

<section>
	<table class="table table-hover">
		<thead class="text-xs uppercase text-left">
			<th>Name</th>
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
</section>
