<script lang="ts">
	import { formatNumberCompact } from '$lib/utils';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let tag: Tables<'tags'>;

	const popupConfig: PopupSettings = { event: 'hover', target: `popup-${crypto.randomUUID()}` };
</script>

<button class="chip variant-filled-primary gap-1 px-1.5 py-1" use:popup={popupConfig}>
	<i class="fas fa-tag" />
	{tag.name} ({formatNumberCompact(tag.usage_count)})
	<a href="/tags/1" target="_blank" class="badge variant-filled h-5 !m-0">
		<i class="fa-solid fa-up-right-from-square text-sm" />
	</a>
</button>

<div class="card px-2 p-1 rounded-lg bg-gray-900 text-white" data-popup={popupConfig.target}>
	<p>It is a door that opens and stuff because reasons.</p>
	<div class="arrow bg-gray-900" />
</div>
