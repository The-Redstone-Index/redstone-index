<script lang="ts">
	import BigRedstoneLogo from '$lib/common/GlowingRedstoneLogo.svelte';
</script>

<section
	class="flex flex-col gap-16 p-5 justify-center items-center min-h-[900px] h-[calc(100vh-300px)]"
>
	<BigRedstoneLogo />

	<div class="w-full flex justify-center">
		<slot />
	</div>
</section>
