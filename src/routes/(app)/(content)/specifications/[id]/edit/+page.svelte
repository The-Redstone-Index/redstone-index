<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import SpecificationEditForm from '../../SpecificationEditForm.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let data;

	let { supabase, spec } = data;
	$: ({ supabase, spec } = data);

	let name = spec.name;
	let description = spec.description;
	let keywords = spec.keywords;
	let unit = spec.unit;

	let blockNavigation = true;
	let loading = false;

	onMount(async () => {
		// Show browser warning when refreshing the page or navigate to an external URL
		window.addEventListener('beforeunload', function (e) {
			if (blockNavigation) {
				e.preventDefault();
				e.returnValue = '';
			}
		});
	});

	beforeNavigate((navigation) => {
		// Show discard changes dialog before navigating to another router link
		if (blockNavigation) {
			navigation.cancel();
			showCancelConfirmationDialog(navigation.to?.url.href);
		}
	});

	function showCancelConfirmationDialog(href: string = '.') {
		modalStore.trigger({
			type: 'confirm',
			title: 'Discard Changes',
			body: 'Any changes you have made will be lost.',
			response: async (r: boolean) => {
				if (r) {
					blockNavigation = false;
					goto(href);
				}
			}
		});
	}

	function showSubmitConfirmationDialog() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Update Specification',
			body: 'Specification will be updated with new information.',
			response: async (r: boolean) => {
				if (r) handleUpdateSpec();
			}
		});
	}

	async function handleUpdateSpec() {
		loading = true;
		const { data, error } = await supabase
			.from('specifications')
			.update({ name, description, keywords, unit })
			.eq('id', spec.id)
			.select()
			.single();

		if (error) {
			let message = error.message;
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
		} else {
			toastStore.trigger({
				message: `<i class="fas fa-check mr-1"></i> Updated Tag!`,
				background: 'variant-filled-success',
				classes: 'pl-8'
			});
			blockNavigation = false;
			await invalidateAll();
			goto(`/specifications/${data.id}`);
		}
	}
	loading = false;
</script>

<svelte:head>
	<title>Edit Spec - The Redstone Index</title>
	<meta name="description" content="See specifications for builds on The Redstone Index." />
</svelte:head>

<div class="container h-full mx-auto justify-center p-4 flex flex-col gap-10 mt-10">
	<a href="." class="anchor">
		<i class="fa-solid fa-angles-left mr-1" />
		Back
	</a>

	<h1 class="h1">Edit Specification</h1>

	<SpecificationEditForm
		bind:name
		bind:description
		bind:keywords
		bind:unit
		{loading}
		on:submit={showSubmitConfirmationDialog}
	/>
</div>
