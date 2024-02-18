<script lang="ts">
	import UserCard from '$lib/cards/UserCard.svelte';
	import UserReportCard from '$lib/cards/UserReportCard.svelte';
	import { supabaseStore } from '$lib/stores';
	import { getUserReports } from '$lib/supabase-api/reports';
	import { getSearchedUsers } from '$lib/supabase-api/users';
	import { Paginator, Tab, TabGroup, getToastStore } from '@skeletonlabs/skeleton';

	const supabase = $supabaseStore;
	const toastStore = getToastStore();

	let tabSet = 0;
	let offset = 0;
	let limit = 25;
	$: userReportsQuery = makeUserReportsQuery({ dismissed: tabSet === 1, offset, limit });

	$: usersQuery = makeUsersQuery({
		role: tabSet === 2 ? 'administrator' : 'moderator',
		offset,
		limit
	});

	async function makeUserReportsQuery({
		dismissed,
		offset,
		limit
	}: {
		dismissed: boolean;
		offset: number;
		limit: number;
	}) {
		return getUserReports(supabase, { dismissed, offset, limit }).then(([data, error, count]) => {
			if (error) throw error;
			return [data, count as number] as const;
		});
	}

	async function makeUsersQuery({
		role,
		offset,
		limit
	}: {
		role: string;
		offset: number;
		limit: number;
	}) {
		return getSearchedUsers(supabase, { limit, offset, role }).then(([data, error, count]) => {
			if (error) throw error;
			if (!data) throw 'No data';
			return [data, count as number] as const;
		});
	}

	async function toggleDismissed(userReport: UserReportDetails) {
		const { error } = await supabase
			.from('user_reports')
			.update({ dismissed: !userReport.dismissed })
			.eq('id', userReport.id);
		if (error) {
			toastStore.trigger({
				message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
				background: 'variant-filled-error',
				classes: 'pl-8'
			});
			return;
		}
		toastStore.trigger({
			message: `<i class="fas fa-check mr-1"></i> Updated.`,
			background: 'variant-filled-success',
			classes: 'pl-8'
		});
		userReportsQuery = makeUserReportsQuery({ dismissed: tabSet === 1, offset, limit });
	}

	async function onAmountChange(e: CustomEvent) {
		const newAmount = e.detail as number;
		limit = newAmount;
	}

	async function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
	}
</script>

<svelte:head>
	<title>Moderation - The Redstone Index</title>
	<meta name="description" content="Dashboard for moderators and admins." />
</svelte:head>

<div class="container mx-auto p-5 mb-14">
	<div class="my-10">
		<h1 class="h2">Moderation Dashboard</h1>
	</div>
	<TabGroup>
		<!-- Tab Buttons -->
		<Tab bind:group={tabSet} name="userReports" value={0}>User Reports</Tab>
		<Tab bind:group={tabSet} name="mods" value={1}>Dismissed User Reports</Tab>
		<div class="flex-1" />
		<Tab bind:group={tabSet} name="tab3" value={2}>Admins</Tab>
		<Tab bind:group={tabSet} name="tab3" value={3}>Moderators</Tab>

		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<!-- User Reports / Dismissed Reports -->
			{#if tabSet === 0 || tabSet === 1}
				{#await userReportsQuery then [data, count]}
					<div class="min-h-[40rem]">
						<div class="flex flex-wrap justify-center gap-3 mb-10">
							{#each data as userReport (userReport.id)}
								<UserReportCard
									{userReport}
									on:dismiss={() => toggleDismissed(userReport)}
									on:un-dismiss={() => toggleDismissed(userReport)}
								/>
							{:else}
								No User Reports!
							{/each}
						</div>
					</div>
					<Paginator
						settings={{
							amounts: [25, 50, 100],
							page: Math.floor(offset / limit),
							limit,
							size: count
						}}
						on:page={onPageChange}
						on:amount={onAmountChange}
					/>
				{:catch e}
					Error: {e.message}
				{/await}
			{:else if tabSet === 2 || tabSet === 3}
				{#await usersQuery then [data, count]}
					<div class="min-h-[40rem]">
						<div class="flex flex-wrap gap-3 mb-10">
							{#each data as user (user.id)}
								<UserCard {user} />
							{:else}
								No Users!
							{/each}
						</div>
					</div>
					<Paginator
						settings={{
							amounts: [25, 50, 100],
							page: Math.floor(offset / limit),
							limit,
							size: count
						}}
						on:page={onPageChange}
						on:amount={onAmountChange}
					/>
				{:catch e}
					Error: {e.message}
				{/await}
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
