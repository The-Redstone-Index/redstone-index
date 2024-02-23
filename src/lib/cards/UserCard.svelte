<script lang="ts">
	import UserMemberChip from '$lib/chips/UserMemberChip.svelte';
	import UserRoleChip from '$lib/chips/UserRoleChip.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { isBanned, isMember } from '$lib/utils';
	import { Avatar } from '@skeletonlabs/skeleton';

	const supabase: SupabaseClient = $supabaseStore;

	export let user: Tables<'users'>;

	$: userIsBanned = isBanned(user);
</script>

<a
	href={`/users/${user.numeric_id}`}
	class="card w-72 flex gap-5 items-center p-5 card-hover"
	on:click
>
	<Avatar
		src={userIsBanned ? undefined : getAvatarUrl(supabase, user.avatar_path)}
		initials={user.username}
	/>
	<div class="overflow-clip flex-1">
		<div class="font-semibold">{user.username}</div>
		<div class="truncate text-sm w-40">
			{#if userIsBanned}
				[User Banned]
			{:else}
				{user.bio}
			{/if}
		</div>
		{#if user.role !== 'authenticated'}
			<UserRoleChip {user} compact />
		{/if}
		{#if isMember(user)}
			<UserMemberChip compact />
		{/if}
	</div>
</a>
