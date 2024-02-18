<script lang="ts">
	import { minecraftStore } from '$lib/stores';

	export let version: number;
	export let type: 'working' | 'breaking' | 'tested' | 'none' = 'none';

	$: versionName = $minecraftStore?.getVersionName(version);
</script>

<div
	class="chip variant-filled inline-block w-fit h-fit text-black"
	class:variant-filled-success={type === 'working'}
	class:variant-filled-error={type === 'breaking'}
	class:!bg-secondary-400={type === 'tested'}
>
	{versionName ?? 'Loading...'}
	{#if type === 'working' || type === 'breaking'}
		+
	{/if}
</div>
