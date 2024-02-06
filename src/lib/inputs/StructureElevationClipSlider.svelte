<script lang="ts">
	import { Popover, Slider as SliderPrimitive } from 'bits-ui';

	type $$Props = SliderPrimitive.Props;
	let className: $$Props['class'] = undefined;

	export let value: $$Props['value'] = [0];
	export { className as class };
</script>

<SliderPrimitive.Root
	bind:value
	let:ticks
	let:thumbs
	class={[
		'relative flex touch-none select-none items-center group',
		$$restProps.orientation === 'vertical' ? 'h-[200px] w-[6px] flex-col' : 'w-full',
		className
	].join(' ')}
	{...$$restProps}
>
	<span
		class="group-hover:bg-surface-400/25 bg-surface-500 relative h-2 w-full grow overflow-hidden rounded-full"
	>
		<SliderPrimitive.Range
			class={[
				'absolute bg-primary-500',
				$$restProps.orientation === 'vertical' ? 'w-full' : 'h-full'
			].join(' ')}
		/>
	</span>

	{#each thumbs as thumb}
		<SliderPrimitive.Thumb
			{thumb}
			class=" bg-surface-800 block h-5 w-5 rounded-full border-2 border-primary-500 outline-none transition-colors
                    focus-visible:ring-2 ring-offset-transparent ring-offset-1 ring-primary-500 focus:outline-none
                    disabled:pointer-events-none disabled:opacity-50 z-10
                "
		/>
	{/each}

	{#each ticks as tick, i}
		<SliderPrimitive.Tick
			{tick}
			class={[
				'bg-surface-200 opacity-30 w-[3px] h-[3px]',
				$$restProps.orientation === 'vertical' ? '!w-[6px]' : '!h-2',
				i === 0 || i === ticks.length - 1 ? 'invisible' : ''
			].join(' ')}
		/>
	{/each}
</SliderPrimitive.Root>
