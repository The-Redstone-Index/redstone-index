<script lang="ts">
	import { ProgressRadial, modalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';

	export let username: string = '';
	let faceUrl: string | undefined;
	let faceBlob: Blob | undefined;
	let loading = false;

	async function loadFace() {
		const currentUsername = username;
		try {
			const res = await fetch(`/api/face/${currentUsername}`);
			if (!res.ok) throw Error('Does not exist');
			if (currentUsername == username) {
				faceBlob = await res.blob();
				faceUrl = URL.createObjectURL(faceBlob);
			}
		} catch (e: any) {}
		if (currentUsername == username) loading = false;
	}

	const loadFaceDebounced = debounce(loadFace, 700);

	function onInput() {
		loading = true;
		faceBlob = undefined;
		faceUrl = undefined;
		if (username) {
			loadFaceDebounced();
		} else {
			loading = false;
		}
	}

	function onSelect() {
		if (!faceBlob) return;
		$modalStore[0].response?.(faceBlob);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Minecraft Face</header>

		{#if loading}
			<div class="w-24 h-24 mx-auto placeholder grid place-items-center">
				<ProgressRadial stroke={150} class="!w-10 !h-10 opacity-50" />
			</div>
		{:else if faceUrl}
			<img
				src={faceUrl}
				alt="Minecraft Face"
				style="image-rendering: pixelated;"
				class="w-24 h-24 mx-auto rounded-3xl"
			/>
		{:else}
			<div class="w-24 h-24 mx-auto placeholder grid place-items-center">
				<div class="mb-1 opacity-40 font-semibold">No Face</div>
			</div>
		{/if}

		<input
			type="text"
			name="username"
			class="input"
			placeholder="Enter username..."
			bind:value={username}
			on:input={onInput}
		/>
		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button
				class="btn variant-filled-primary"
				on:click={onSelect}
				type="button"
				disabled={!faceBlob}
			>
				Select this Face
			</button>
		</div>
	</div>
</div>
