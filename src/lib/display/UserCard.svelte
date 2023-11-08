<script lang="ts">
	import { getAvatarUrl } from '$lib/api';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let supabase: SupabaseClient;
	export let user: Tables<'users'>;
</script>

<a href={`/users/${user.numeric_id}`} class="card w-72 flex gap-5 items-center p-5 card-hover">
	<Avatar src={getAvatarUrl(supabase, user.avatar_path)} initials={user.username} />
	<div class="overflow-clip flex-1">
		<div class="font-semibold">{user.username}</div>
		<div class="truncate text-sm">{user.bio}</div>
	</div>
</a>
