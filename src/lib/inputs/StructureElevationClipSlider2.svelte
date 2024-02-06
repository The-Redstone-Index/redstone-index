<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';
	import { uniq } from 'lodash';

	export let value: number[];
	export let min: number;
	export let max: number;

	const {
		elements: { root, range, thumbs, ticks }
	} = createSlider({
		defaultValue: value,
		min,
		max,
		step: 1,
		onValueChange: ({ curr, next }) => {
			const newValue = uniq(next).length === next.length ? next : curr;
			value = newValue;
			return newValue;
		},
		orientation: 'vertical'
	});
</script>

<span use:melt={$root} class="relative h-full w-[6px] flex flex-col items-center group">
	<span
		class="group-hover:bg-surface-400/25 bg-surface-500 relative h-2 w-full grow overflow-hidden rounded-full"
	>
		<span use:melt={$range} class="absolute bg-primary-500 w-full" />
	</span>

	{#each $thumbs as thumb}
		<span
			use:melt={thumb}
			class="
            bg-surface-800 block h-5 w-5 rounded-full border-2 border-primary-500 outline-none transition-colors
            focus-visible:ring-2 ring-offset-transparent ring-offset-1 ring-primary-500 focus:outline-none
            disabled:pointer-events-none disabled:opacity-50 z-10
            "
		/>
	{/each}

	{#each $ticks as tick, i}
		<span
			use:melt={tick}
			class="bg-surface-200 opacity-30 w-[6px] h-[3px]"
			class:invisible={i === 0 || i === $ticks.length - 1}
		/>
	{/each}
</span>
