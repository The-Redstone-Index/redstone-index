<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';

	let title =
		'Compact Instant 0-Tick 2 Wide Tileable Binary Adder Awesome Build Super cool mega project'.slice(
			0,
			Math.floor(Math.random() * 109)
		);
	let author = 'plasmatech8';
	let imgSrc = `https://picsum.photos/500/500?i=${Math.random()}`;
	let h = 0;
</script>

<a href="/builds/0" class="relative block card card-hover overflow-clip !w-96 group h-fit">
	<!-- Image -->
	<img src={imgSrc} alt="" class="object-cover w-full h-72" />
	<!-- Title -->
	<div class="w-96 overflow-clip transition-height" style="height: {h}px">
		<h5
			bind:clientHeight={h}
			class="truncate transition-color duration-500 group-hover:whitespace-normal group-hover:text-primary-600 dark:group-hover:text-primary-500 font-bold tracking-tight py-1 p-2 text-lg"
		>
			{title}
		</h5>
	</div>
	<!-- Author -->
	<footer class="p-1 flex justify-start items-center space-x-4">
		<Avatar src="https://i.pravatar.cc/160?img=48" width="w-10 flex-shrink-0" />
		<div class="flex justify-between items-center opacity-70 grow">
			<div class="max-w-[215px]">
				<small class="font-bold truncate">By {author}</small>
			</div>
			<small class="mr-3 whitespace-nowrap flex-shrink-0">On 26/02/2023</small>
		</div>
	</footer>
</a>
