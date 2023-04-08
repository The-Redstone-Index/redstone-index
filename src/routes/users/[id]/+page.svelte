<script lang="ts">
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Avatar, FileButton, Tab, TabGroup, Toast, toastStore } from '@skeletonlabs/skeleton';

	const t: ToastSettings = {
		message: 'Click <b>Publish</b> on a Schematic to publish a New Build!',
		background: 'variant-filled-primary'
	};

	let tabSet = 0;
	let schematicTabHighlight = false;
</script>

<svelte:head>
	<title>Profile - The Redstone Index</title>
</svelte:head>

<div class="container h-full mx-auto justify-center p-4">
	<div class="flex mb-5 items-center gap-5">
		<Avatar width="w-24" src="https://i.pravatar.cc/" cursor="cursor-pointer" />
		<h1>plasmatech8</h1>
	</div>

	<div class="mb-5 flex gap-3 justify-end items-center">
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				tabSet = 1;
				schematicTabHighlight = true;
				setTimeout(() => (schematicTabHighlight = false), 1500);
				toastStore.trigger(t);
			}}
		>
			Create New Build
		</button>
		or
		<FileButton name="upload-schatic-button">Upload Schematic</FileButton>
	</div>

	<TabGroup>
		<Tab bind:group={tabSet} name="builds" value={0}>Builds (5)</Tab>
		<Tab bind:group={tabSet} name="schematics" value={1}>
			<div
				class:animate-bounce={schematicTabHighlight}
				class:text-primary-500={schematicTabHighlight}
				class="transition-colors"
			>
				Schematics (54)
			</div>
		</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				Builds
			{:else if tabSet === 1}
				<div>asdasdas</div>
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>

<Toast />
