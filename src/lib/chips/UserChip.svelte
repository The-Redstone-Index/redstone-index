<script lang="ts">
	import { supabaseStore } from '$lib/stores';
	import { getAvatarUrl } from '$lib/supabase-api/storage';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let user: Tables<'users'>;
	export let showDelete: boolean = false;
	export let selected: boolean = false;
	export let showLink: boolean = false;

	const supabase = $supabaseStore;

	const dispatch = createEventDispatcher();
</script>

<!-- Inside key: selected block because Svelte does not remove the checkmark properly for some reason -->
{#key selected}
	<button
		class="chip variant-soft-surface flex items-center gap-2 p-2 justify-start rounded-xl w-64"
		on:click
		type="button"
	>
		{#if selected}
			<i class="fas fa-check" />
		{/if}

		<Avatar width="w-14" src={getAvatarUrl(supabase, user.avatar_path)} initials={user.username} />

		<div class="overflow-clip flex-1">
			<div class="font-semibold">{user.username}</div>
			<div class="truncate text-sm">{user.bio}</div>
		</div>

		{#if showLink}
			<a href={`/users/${user.numeric_id}`} target="_blank" class="badge variant-filled h-4 !m-0">
				<i class="fa-solid fa-up-right-from-square text-sm h-3 opacity-70 hover:opacity-100" />
			</a>
		{/if}

		{#if showDelete}
			<button type="button" on:click={() => dispatch('delete')}>
				<i class="fas fa-xmark" />
			</button>
		{/if}
	</button>
{/key}
