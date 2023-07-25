<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	type Option = { value: string; keywords: string };

	export let options: Option[];
	export let selected: string[] = [];
	export let name: string = '';

	let search: string = '';
	let searchOptions = options;
	$: {
		const searchTerms = search
			.toLowerCase()
			.split(' ')
			.filter((v) => v);

		const filteredOptions = searchTerms.length
			? options.filter((option) =>
					searchTerms.some(
						(term) =>
							option.value.toLowerCase().includes(term) ||
							option.keywords.toLowerCase().includes(term)
					)
			  )
			: options;

		const selectedFilteredOptions = filteredOptions.filter((o) => selected.includes(o.value));
		const unselectedFilteredOptions = filteredOptions.filter((o) => !selected.includes(o.value));
		searchOptions = [...selectedFilteredOptions, ...unselectedFilteredOptions];
	}

	const popupSettings: PopupSettings = {
		event: 'click',
		target: 'popupMenu',
		placement: 'bottom-start'
	};

	function handleCheckboxChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		const isChecked = target.checked;
		if (isChecked) {
			selected = [...selected, value];
		} else {
			selected = selected.filter((v) => v !== value);
		}
	}
</script>

<div>
	<button class="btn variant-filled-primary" type="button" use:popup={popupSettings}>
		<slot />
	</button>

	<div data-popup="popupMenu" class="card w-72 shadow-xl z-[999]">
		<div class="flex flex-col">
			<div class="p-3">
				<input type="search" class="input" placeholder="Search..." bind:value={search} />
			</div>
			<hr />
			<div class="flex flex-col gap-2 overflow-auto h-80 p-2 pr-1">
				{#each searchOptions.slice(0, 100) as option (option)}
					<label
						class="flex items-center space-x-2 hover:bg-surface-200-700-token focus-within:bg-surface-200-700-token  rounded-lg p-2"
						in:fade={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
					>
						<input
							class="checkbox"
							type="checkbox"
							{name}
							value={option.value}
							on:change={handleCheckboxChange}
							checked={selected.includes(option.value)}
						/>
						<p>{option.value}</p>
					</label>
				{:else}
					<slot name="no-results">
						<div class="h-full w-full grid place-items-center pr-2 font-semibold opacity-40">
							No Results Found
						</div>
					</slot>
				{/each}
				{#if searchOptions.length > 100}
					<div class="flex items-center space-x-2 p-2 opacity-40">
						+{searchOptions.length - 100} More
					</div>
				{/if}
			</div>
			<hr />
			<div class="py-3 px-5">{selected.length} Selected</div>
		</div>
	</div>
</div>
