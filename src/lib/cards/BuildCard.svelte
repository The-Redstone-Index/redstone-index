<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingSpinnerArea from '$lib/common/LoadingSpinnerArea.svelte';
	import StaticStructurePreview from '$lib/minecraft/StaticStructurePreview.svelte';
	import StructureViewer from '$lib/minecraft/StructureViewer.svelte';
	import { getStructureSize } from '$lib/minecraft/utils';
	import { minecraftStore, supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Resources } from 'deepslate';
	import { onMount } from 'svelte';

	export let build: BuildCardDetails;
	export let to: string | undefined = undefined;

	const resources: Resources | undefined = $minecraftStore?.resources;
	const supabase: SupabaseClient = $supabaseStore;

	let titleHeight = 0;
	let hovering = false;
	let visible = false;
	let root: Element;
	let loaded = false;
	let failed = false;
	$: if (!hovering) loaded = false;
	let schemaData: ArrayBuffer;
	let schemaSize: { x: number; y: number; z: number };

	async function loadSchemaData() {
		const { data, error } = await supabase.storage
			.from('schematics')
			.download(build.schematic.object_path);
		if (error) {
			console.warn('Error downloading schematic:' + error.message);
			failed = true;
		}
		if (data) {
			schemaData = await data.arrayBuffer();
			schemaSize = getStructureSize(schemaData);
		}
	}
	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					visible = true;
					loadSchemaData();
					observer.disconnect();
				}
			});
		});
		observer.observe(root);
		return () => observer.disconnect();
	});
</script>

<div
	role="article"
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus={() => (hovering = true)}
	bind:this={root}
>
	<a
		href={to}
		class="relative block !card card-hover overflow-clip !w-80 group h-fit origin-top-left"
		on:click
	>
		<!-- Preview Section -->
		<div class="relative w-80 h-64 overflow-hidden bg-surface-800 group-hover:bg-surface-700">
			<!-- Structure Preview -->
			{#if failed}
				<div class="grid place-items-center h-72 text-4xl text-gray-400">
					<i class="fa-solid fa-circle-exclamation animate-pulse" />
				</div>
			{:else if resources && browser && schemaData}
				<div class="flex flex-col" class:flex-col-reverse={loaded && hovering}>
					<div class="w-80 h-72">
						<StaticStructurePreview {schemaData} {resources} />
					</div>
					<div class="w-80 h-72">
						{#if hovering}
							<StructureViewer {schemaData} {resources} doStaticRotation bind:loaded />
						{/if}
					</div>
				</div>
			{:else}
				<div class="h-72">
					<LoadingSpinnerArea />
				</div>
			{/if}

			<!-- Above Stats -->
			<div class="absolute top-0 p-3 w-full text-white text-xs opacity-70 group-hover:opacity-90">
				<div class="flex justify-between gap-1 w-full">
					<div>
						<i class="fa-regular fa-thumbs-up mr-1" />
						{build.likes_count}
					</div>
					<div class="text-end">
						{#if minecraftStore}
							<div>
								{#if build.works_in_version}
									{$minecraftStore?.getVersionName(build.works_in_version) ?? '...'}+
								{:else if build.tested_in_version}
									{$minecraftStore?.getVersionName(build.tested_in_version) ?? '...'}
								{/if}
							</div>
							<div class="text-error-600">
								{#if build.breaks_in_version}
									{$minecraftStore?.getVersionName(build.breaks_in_version) ?? '...'}-
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Below Stats -->
			<div
				class="absolute bottom-0 p-2 w-full text-white text-xs opacity-50 group-hover:opacity-60"
			>
				<div class="flex justify-end gap-1 w-full">
					<span class="text-red-500">{schemaSize?.x ?? build.size_dimensions[0]}</span>
					×
					<span class="text-green-500">{schemaSize?.y ?? build.size_dimensions[1]}</span>
					×
					<span class="text-blue-500">{schemaSize?.z ?? build.size_dimensions[2]}</span>
				</div>
			</div>
		</div>

		<!-- Title -->
		<header class="w-80 overflow-clip transition-height" style="height: {titleHeight}px">
			<div
				bind:clientHeight={titleHeight}
				class="truncate transition-none group-hover:whitespace-normal group-hover:text-primary-600 dark:group-hover:text-primary-500 font-bold tracking-tight py-1 p-2 !text-base"
			>
				{build.title}
			</div>
		</header>
		<!-- Author -->
		<footer class="p-1 flex justify-start items-center space-x-4">
			<Avatar
				initials={build.author.username}
				src={getAvatarUrl(supabase, build.author.avatar_path)}
				width="w-9 flex-shrink-0"
			/>
			<div class="flex justify-between items-center opacity-70 grow">
				<div class="max-w-[215px]">
					<small class="font-bold truncate">By {build.author.username}</small>
				</div>
				<small class="mr-3 whitespace-nowrap flex-shrink-0">
					{new Date(build.created_at).toLocaleDateString()}
				</small>
			</div>
		</footer>
	</a>
</div>
