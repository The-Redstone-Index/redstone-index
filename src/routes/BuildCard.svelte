<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';

	let title =
		'Compact Instant 0-Tick 2 Wide Tileable Binary Adder Awesome Build Super cool mega project'.slice(
			0,
			Math.floor(Math.random() * 109)
		);
	let author = 'plasmatech8';
	let imgSrc = `https://picsum.photos/500/500?i=${Math.random()}`;
</script>

<a href="/builds/0" class="card card-hover overflow-clip !w-96">
	<!-- Image -->
	<img src={imgSrc} alt="" class="object-cover w-full h-72" />
	<!-- Title -->
	<h5 class="overflow-hidden truncate font-bold tracking-tight px-3 py-1 text-lg">
		{title}
	</h5>
	<!-- Author -->
	<footer class="p-1 flex justify-start items-center space-x-4">
		<Avatar src="https://i.pravatar.cc/160?img=48" width="w-10 flex-shrink-0" />
		<div class="flex justify-between items-center opacity-70 grow">
			<div class="max-w-[215px]">
				<h6 class="font-bold truncate">By {author}</h6>
			</div>
			<small class="mr-3 whitespace-nowrap flex-shrink-0">On 26/02/2023</small>
		</div>
	</footer>
</a>
