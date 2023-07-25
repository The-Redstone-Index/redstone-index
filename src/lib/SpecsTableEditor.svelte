<script lang="ts">
	export let specifications: { name: String; value: String }[];
</script>

<table class="table table-hover">
	<thead class="text-left">
		<th>Item</th>
		<th>Value</th>
		<th />
	</thead>
	<tbody>
		{#each specifications as spec, i}
			<tr class="focus-within:table-row-checked">
				<td contenteditable="true" class="focus:outline-none table-cell-fit min-w-[250px]">
					{spec.name}
				</td>
				<td contenteditable="true" class="focus:outline-none">
					{spec.value}
				</td>
				<td class="table-cell-fit">
					<button
						class="btn-icon-sm"
						on:click={() => {
							specifications.splice(i, 1);
							specifications = specifications;
						}}
					>
						<i class="fa-solid fa-xmark" />
					</button>
				</td>
			</tr>
		{/each}
		<tr
			on:click={() => {
				specifications = [...specifications, { name: '', value: '' }];
			}}
		>
			<td class="font-bold cursor-pointer">+ Add Row</td>
			<td />
			<td />
		</tr>
	</tbody>
</table>
