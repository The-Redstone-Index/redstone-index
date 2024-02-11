<script lang="ts">
	let btn: HTMLButtonElement;
	let lastTimeout: ReturnType<typeof setTimeout>;

	function onClick() {
		clearTimeout(lastTimeout);
		lastTimeout = setTimeout(() => btn.blur(), 600);
	}
</script>

<button class="boop" bind:this={btn} on:click={onClick}>
	<slot />
</button>

<style lang="postcss">
	@keyframes boop {
		0% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(-15deg);
		}
		40% {
			transform: rotate(15deg);
		}
		60% {
			transform: rotate(-7deg);
		}
		80% {
			transform: rotate(7deg);
		}
		90% {
			transform: rotate(-3deg);
		}
		95% {
			transform: rotate(2deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
	.boop:focus {
		display: inline-block;
		animation: 0.6s boop forwards running;
	}
</style>
