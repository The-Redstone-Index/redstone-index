<script lang="ts">
	export let specifications: { name: String; value: String }[];
	export let editing = false;

	function handleInput(event: Event, fun: (input: String) => void) {
		console.log(event);
		const target = event.target as HTMLElement;
		const text = target.innerText;
		fun(text);
	}
</script>

{#if editing}
	<table class="table table-hover table-hover-add-btn">
		<thead class="text-left">
			<th>Name</th>
			<th>Value</th>
			<th />
		</thead>
		<tbody>
			{#each specifications as spec, i}
				<tr class="focus-within:table-row-checked">
					<td
						contenteditable="true"
						class="focus:outline-none table-cell-fit min-w-[250px]"
						on:input={(e) => {
							handleInput(e, (s) => (spec.name = s));
						}}
					>
						{spec.name}
					</td>
					<td
						contenteditable="true"
						class="focus:outline-none"
						on:input={(e) => {
							handleInput(e, (s) => (spec.value = s));
						}}
					>
						{spec.value}
					</td>
					<td class="table-cell-fit">
						<button
							type="button"
							class="btn-icon btn-icon-sm hover:variant-soft-primary"
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
			<tr on:click={() => (specifications = [...specifications, { name: '', value: '' }])}>
				<td class="font-bold cursor-pointer hover:text-primary-700-200-token">+ Add Row</td>
				<td />
				<td />
			</tr>
		</tbody>
	</table>
{:else}
	<table class="table table-hover">
		<thead class="text-left">
			<th>Name</th>
			<th>Value</th>
		</thead>
		<tbody>
			{#each specifications as spec}
				<tr>
					<td class="table-cell-fit min-w-[250px]">{spec.name}</td>
					<td>{spec.value}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	.table-hover-add-btn tbody tr:hover:last-child {
		background-color: rgb(var(--color-primary-500) / 0.2);
	}
</style>
