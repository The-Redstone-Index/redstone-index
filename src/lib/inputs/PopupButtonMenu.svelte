<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	type Option = { name: string; value: any; keywords: string };

	export let options: Option[];
	export let selected: any | undefined;

	let search: string = '';
	let searchOptions = options;
	$: {
		const searchTerms = search
			.toLowerCase()
			.split(' ')
			.filter((v) => v);
		searchOptions = searchTerms.length
			? options.filter((option) =>
					searchTerms.some((term) => option.keywords.toLowerCase().includes(term))
			  )
			: options;
	}

	const popupSettings: PopupSettings = {
		event: 'click',
		target: 'popupMenu-' + Math.random(),
		placement: 'bottom-start'
	};
</script>

<div>
	<button class="btn variant-filled-primary" type="button" use:popup={popupSettings}>
		<slot />
	</button>

	<div data-popup={popupSettings.target} class="card w-72 shadow-xl z-[999]">
		<div class="flex flex-col">
			<div class="p-3">
				<input type="search" class="input" placeholder="Search..." bind:value={search} />
			</div>
			<hr />
			<div class="flex flex-col gap-2 overflow-auto h-80 p-2 pr-1">
				{#each searchOptions.slice(0, 100) as option (option)}
					<button
						class="flex items-center space-x-2 hover:bg-surface-200-700-token focus-within:bg-surface-200-700-token rounded-lg p-2"
						class:!variant-soft-primary={selected == option.value}
						in:fade={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
						on:click={() => (selected = option.value)}
						type="button"
					>
						<p>{option.name}</p>
					</button>
				{:else}
					<slot name="no-results">
						<div class="h-full w-full grid place-items-center pr-2 font-semibold opacity-40">
							No Results Found
						</div>
					</slot>
				{/each}
			</div>
		</div>
	</div>
</div>
