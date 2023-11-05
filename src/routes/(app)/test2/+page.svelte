<script lang="ts">
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
		const userId = session?.user.id;
		if (!userId) throw 'no user ID';

		const x = await supabase.rpc('ban_user', {
			user_id: '294f5815-8923-4199-8c7d-1f97eff84565',
			until_date: new Date().toISOString()
		});
		// const x = await supabase
		// 	.from('users_restricted')
		// 	.select('*')
		// 	.eq('id', '294f5815-8923-4199-8c7d-1f97eff84565');

		console.log(x.data);
	}
</script>

<button class="btn variant-outline-primary" on:click={signin}>signin</button>
<button class="btn variant-outline-primary" on:click={query}>CLICK ME?</button>
