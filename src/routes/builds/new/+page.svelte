<script lang="ts">
	import type { BuildType } from '$lib/types';
	import { onMount } from 'svelte';
	import { endpoint, type MinecraftVersions } from './versionsAPI';

	let schematicFileList: FileList;
	let photosFileList: FileList;
	let buildType: BuildType = 'Contraption';

	let types: { name: BuildType; desc: string }[] = [
		{
			name: 'Circuit',
			desc: 'A fundamental component used to transform a redstone signal, recieve an input, or perform a basic action. e.g. Monostable circuit, memory cell, T flip-flop.'
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
	let tags = '';
	$: {
		tags = tags
			.split(' ')
			.filter((t) => t !== '#')
			.map((t) => (t.startsWith('#') ? t : `#${t}`))
			// .filter((t) => t.length)
			.join(' ');
	}
	let minecraftVersionsList: MinecraftVersions;
	let includeSnapshots: boolean = false;
	let versions: string[] = [];
	let specifications: { item: String; value: String }[] = [
		{ item: 'Items per minute', value: '124' },
		{ item: 'Input delay', value: '5 game ticks' },
		{ item: 'Automation', value: 'Semi-automatic' },
		{ item: 'Iterations per minute', value: '5' },
		{ item: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
	];

	onMount(async () => {
		const res = await fetch(endpoint);
		const json = await res.json();
		minecraftVersionsList = json;
	});
</script>

<svelte:head>
	<title>The Redstone Index - New Build</title>
</svelte:head>

<div class="container mx-auto p-5">
	<h1 class="my-8">Submit New Build</h1>
	<form method="post">
		<div class="flex gap-10 flex-col mb-10">
			<!-- Type -->
			<div class="flex flex-col gap-2">
				<label for="type" class="block mb-2">Type * (select one)</label>
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
									<div class="w-full">{t.desc}s</div>
								</div>
							</label>
						</div>
					{/each}
				</div>
			</div>

			<!-- Title -->
			<div>
				<label for="title" class="block mb-2">Title *</label>
				<input
					id="title"
					class="input"
					type="text"
					placeholder="Write a title for this build... (e.g. Compact Instant 0-Tick 2 Wide Tileable Binary Adder)"
					name="title"
				/>
			</div>

			<!-- Description -->
			<div>
				<label for="description" class="block mb-2">Description</label>
				<textarea
					id="description"
					class="textarea"
					placeholder="Write a summary of the build and outline any relevant details..."
					name="description"
				/>
			</div>

			<!-- Specifications -->
			<div class="flex flex-col gap-2">
				<label for="specifications" class="block">Specifications (edit table)</label>
				<div class="table-container input-group">
					<table class="table table-hover">
						<thead class="text-left">
							<th>Item</th>
							<th>Value</th>
							<th />
						</thead>
						<tbody>
							{#each specifications as spec, i}
								<tr class="focus-within:table-row-checked">
									<td
										contenteditable="true"
										class="focus:outline-none table-cell-fit min-w-[250px]"
									>
										{spec.item}
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
									specifications = [...specifications, { item: '', value: '' }];
								}}
							>
								<td class="font-bold cursor-pointer">+ Add Row</td>
								<td />
								<td />
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Schematic File -->
			<div class="flex flex-col gap-2">
				<label for="schematic-upload" class="block">Upload Schematic (NBT) *</label>
				<input
					type="file"
					class="input"
					id="schematic-upload"
					name="schematic-upload"
					bind:files={schematicFileList}
				/>
			</div>

			<!-- Photos -->
			<div class="flex flex-col gap-2">
				<label for="photos-upload" class="block">Upload Photos (SVG, PNG, JPG, GIF)</label>
				<input
					id="photos-upload"
					class="input"
					name="photos-upload"
					type="file"
					multiple
					bind:files={photosFileList}
				/>
				{#if photosFileList}
					<ul class="w-fit list">
						{#each Array.from(photosFileList) as item}
							<li>
								{item.name}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!-- Version Compatability -->
			<div class="flex flex-col gap-2">
				<label for="versions" class="block">Version Compatability</label>
				<div>
					<button color="primary">Compatible In...</button>
					Dropdown...
				</div>
				<div class="flex flex-nowrap gap-3 overflow-x-auto p-1 text-gray-600 dark:text-gray-300">
					{#each versions.sort((a, b) => {
						if (a.toLowerCase().includes('breaks') && !b.toLowerCase().includes('breaks')) {
							return -1;
						}
						if (a > b) return 1;
						return 0;
					}) as version}
						<div
							class="rounded-md bg-gray-50 p-2 outline outline-2 outline-gray-200 dark:bg-gray-900 dark:outline-gray-700"
							class:text-red-500={version.toLowerCase().includes('breaks')}
						>
							{version}
						</div>
					{/each}
				</div>
			</div>

			<!-- Tags -->
			<div>
				<label for="tags" class="block mb-2">Tags</label>
				<input
					id="tags"
					type="text"
					name="tags"
					placeholder="e.g. Compact Instant 0-Tick 2 Wide Tileable Binary Adder"
					class="input"
					bind:value={tags}
				/>
			</div>

			<!-- Submit Button -->
			<button class="btn variant-filled-primary md:w-fit" type="submit">Publish</button>
		</div>
	</form>
</div>
