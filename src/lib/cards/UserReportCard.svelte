<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let userReport: UserReportDetails;

	const dispatch = createEventDispatcher();

	function onDismissClick() {
		dispatch('dismiss');
	}
	function onUnDismissClick() {
		dispatch('un-dismiss');
	}
</script>

<div class="card w-96 flex flex-col gap-2 p-5">
	<div class="font-semibold">#{userReport.id} {userReport.topic}</div>

	<div>Reason:</div>
	<div class="blockquote">{userReport.reason}</div>

	<div>User:</div>
	<div class="blockquote">
		<a href={`/users/${userReport.reported_user?.numeric_id}`} class="anchor" target="_blank">
			{userReport.reported_user?.username ?? 'N/A'}
		</a>
	</div>

	<div class="italic flex-1">
		Reported by <a
			href={`/users/${userReport.reporter_user?.numeric_id}`}
			class="anchor"
			target="_blank"
		>
			{userReport.reporter_user?.username ?? 'N/A'}
		</a>
		on {new Date(userReport.created_at).toLocaleDateString()}
	</div>
	<a href={userReport.link} target="_blank" class="btn btn-sm variant-soft-primary">
		<i class="fa-solid fa-up-right-from-square mr-1" />
		Link
	</a>
	{#if userReport.dismissed}
		<button class="btn btn-sm variant-soft-surface" on:click={onUnDismissClick}>Un-dismiss?</button>
	{:else}
		<button class="btn btn-sm variant-soft-surface" on:click={onDismissClick}>Dismiss</button>
	{/if}
</div>
