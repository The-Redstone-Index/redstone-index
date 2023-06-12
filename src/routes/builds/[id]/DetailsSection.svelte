<script lang="ts">
	export let stats: Array<{ item: string; value: string | number }>;
</script>

<section>
	<div>
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
	</div>
</section>
