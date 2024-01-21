<script lang="ts">
	import UserRoleChip from '$lib/chips/UserRoleChip.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { Avatar } from '@skeletonlabs/skeleton';

	const supabase: SupabaseClient = $supabaseStore;

	export let user: Tables<'users'>;
</script>

<a
	href={`/users/${user.numeric_id}`}
	class="card w-72 flex gap-5 items-center p-5 card-hover"
	on:click
>
	<Avatar src={getAvatarUrl(supabase, user.avatar_path)} initials={user.username} />
	<div class="overflow-clip flex-1">
		<div class="font-semibold">{user.username}</div>
		<div class="truncate text-sm">{user.bio}</div>
		{#if user.role !== 'authenticated'}
			<UserRoleChip {user} compact />
		{/if}
	</div>
</a>
