<script lang="ts">
	export let size: 'lg' | 'md' | 'sm' = 'md';
	export let pulse = false;

	const config = {
		lg: {
			glow: 'dark:scale-[.6] blur-2xl dark:blur-3xl mt-2',
			size: 'h-52 w-52'
		},
		md: {
			glow: 'dark:scale-[.6] blur-xl dark:blur-2xl mt-1',
			size: 'h-32 w-32'
		},
		sm: {
			glow: 'dark:scale-[.7] blur-md dark:blur-md mt-0.5',
			size: 'h-9 w-9'
		}
	};
	$: currentClasses = config[size];
</script>

<div
	class="grid place-items-center relative z-0 pointer-events-none select-none {currentClasses.size} {$$props.class}"
>
	<div
		class="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 h-full aspect-square rounded-full -z-10 {currentClasses.glow}"
		class:animate-pulse={pulse}
	/>
	<img src="/redstone_dust.webp" alt="Redstone Index Logo" class={currentClasses.size} />
</div>
