<script lang="ts">
	import StructureElevationClipSlider from '$lib/inputs/StructureElevationClipSlider.svelte';
	import Slider from '$lib/inputs/StructureElevationClipSlider2.svelte';

	export let data;
	let { supabase, session } = data;
	$: ({ session } = data);

	async function signin() {
		const x = await supabase.auth.signInWithPassword({
			email: 'markjunk669+HELLO@gmail.com',
			password: 'asdasdasd'
		});
		// console.log(x);
	}

	async function query() {
		// const x = await supabase.rpc('callback2', { x: 'hello' });

		// console.log('?');
		const x = await supabase
			.from('users')
			.update({ role: 'moderator' })
			.eq('id', '294f5815-8923-4199-8c7d-1f97eff84565');
		// const x = await supabase.from('build_extra_schematics').delete();
		// 	.eq('build_id', 2)
		// 	.eq('schematic_id', 4);
		// const x = await supabase
		// 	.from('test_users')
		// 	.update({ bio: 'hello' })
		// 	.neq('user_id', crypto.randomUUID());
		console.log(x);
	}
</script>

<button class="btn variant-outline-primary" on:click={signin}>signin</button>
<button class="btn variant-outline-primary" on:click={query}>CLICK ME?</button>

<div class="mx-auto flex flex-col gap-10 p-10">
	<StructureElevationClipSlider
		value={[10, 20]}
		min={0}
		max={40}
		class="!h-96"
		orientation="vertical"
	/>

	<StructureElevationClipSlider
		value={[10, 20]}
		min={0}
		max={40}
		class="!w-96"
		orientation="horizontal"
	/>
</div>

<div class="mx-auto flex flex-col gap-10 p-10 h-[1000px]">
	<Slider value={[20, 40]} min={0} max={50} />
</div>
