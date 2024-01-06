<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isSet = false;

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-3 items-center">
	<button class="btn variant-filled-primary" on:click>
		<slot name="button" />
	</button>
	{#if isSet}
		<div class="flex items-center gap-1 btn btn-sm variant-soft-surface pr-2">
			<slot name="info" />
			<button class="btn-icon w-6 hover:variant-soft-error" on:click={() => dispatch('clear')}>
				<i class="fa-solid fa-xmark" />
			</button>
		</div>
	{/if}
</div>
