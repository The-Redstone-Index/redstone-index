<script lang="ts">
	import type { BuildType } from '$lib/types';

	let types: { name: BuildType; desc: string }[] = [
		{
			name: 'Circuit',
			desc: 'A fundamental component used to transform a redstone signal, receive an input, or perform a basic action. e.g. Monostable circuit, memory cell, T flip-flop.'
		},
		{
			name: 'Module',
			desc: 'A system which can be activated to perform an action as part of a build.'
		},
		{
			name: 'Contraption',
			desc: 'A complete build for end-users. e.g. Farms, doors, storage systems.'
		}
	];
</script>

<div class="grid w-full gap-6 md:grid-cols-3">
	{#each types as t}
		<div>
			<input
				type="radio"
				id={'build-type-' + t.name}
				name="build-type"
				value={t.name}
				class="hidden peer"
				required
			/>
			<label
				for={'build-type-' + t.name}
				class="inline-flex h-full items-center justify-between w-full p-5 border border-surface-200 dark:border-surface-500 rounded-3xl cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 dark:peer-checked:border-primary-500 dark:peer-checked:text-primary-500 card card-hover"
			>
				<div class="block">
					<div class="w-full text-lg font-semibold">{t.name}</div>
					<div class="w-full">{t.desc}</div>
				</div>
			</label>
		</div>
	{/each}
</div>
