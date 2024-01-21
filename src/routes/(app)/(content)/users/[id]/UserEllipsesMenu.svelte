<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabaseStore } from '$lib/stores';
	import { submitUserReport } from '$lib/supabase-api/reports';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let target: string;
	export let profile: Tables<'users'>;
	export let selfUser: Tables<'users'> | undefined;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const supabase = $supabaseStore;

	function openReportUserModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Report User',
			body: 'Please provide a brief explanation of why you are reporting this user',
			valueAttr: { type: 'text', minlength: 3, maxlength: 1000, required: true },
			response: async (r) => {
				if (r) {
					const info = {
						reportedUserId: profile.id,
						reporterUserId: selfUser?.id as string,
						link: `/users/${profile.numeric_id}`,
						topic: 'Reported User Profile',
						reason: r
					};
					const error = await submitUserReport(supabase, info);
					if (error) {
						toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
						return;
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> Report Submitted!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
				}
			}
		});
	}

	function openBanUserModal() {
		const bannedUntilDate = profile.banned_until
			? new Date(profile.banned_until).toISOString().split('T')[0]
			: undefined;
		const currentDate = new Date().toISOString().split('T')[0];
		modalStore.trigger({
			type: 'prompt',
			title: 'Ban User',
			body: `
                <p>Set a specific expiration date for the user's ban.</p><br>
                <p>Use current date to remove an existing ban.</p><br>
                ${bannedUntilDate ? `<p>(Latest ban expiry date: ${bannedUntilDate})</p><br>` : ''}
            `,
			// "Set a specific expiration date for the user's ban.",
			valueAttr: {
				type: 'date',
				required: true,
				min: currentDate
			},
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('users')
						.update({ banned_until: r })
						.eq('id', profile.id);
					if (error) {
						return toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> User Ban Configured!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
					invalidateAll();
				}
			}
		});
	}

	function openChangeMemberUntilModal() {
		const memberUntilDate = profile.member_until
			? new Date(profile.member_until).toISOString().split('T')[0]
			: undefined;
		const currentDate = new Date().toISOString().split('T')[0];
		modalStore.trigger({
			type: 'prompt',
			title: 'Change Member Status',
			body: `
                <p>Set a specific expiration date for the user's member status.</p><br>
                <p>Use current date to remove membership.</p><br>
                ${memberUntilDate ? `<p>(Current expiry date: ${memberUntilDate})</p><br>` : ''}
            `,
			valueAttr: {
				type: 'date',
				required: true,
				min: currentDate
			},
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('users')
						.update({ member_until: r })
						.eq('id', profile.id);
					if (error) {
						return toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> User Membership Configured!`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
					invalidateAll();
				}
			}
		});
	}

	function openChangeUserRoleModal(oldRole: string, newRole: string) {
		modalStore.trigger({
			type: 'confirm',
			title: 'Change User Role',
			body: `
                <p>Change user role from <b>${oldRole}</b> to <b>${newRole}</b>.</p><br>
                <p>Are you sure?</p><br>
            `,
			response: async (r) => {
				if (r) {
					const { error } = await supabase
						.from('users')
						.update({ role: newRole })
						.eq('id', profile.id);
					if (error) {
						return toastStore.trigger({
							message: `<i class="fas fa-triangle-exclamation mr-1"></i> ${error.message}`,
							background: 'variant-filled-error',
							classes: 'pl-8'
						});
					}
					toastStore.trigger({
						message: `<i class="fas fa-check mr-1"></i> User Role Changed! <p><b>User may need to sign out and in again to receive new permissions.</b></p>`,
						background: 'variant-filled-success',
						classes: 'pl-8'
					});
					invalidateAll();
				}
			}
		});
	}
</script>

<nav class="list-nav card p-1 shadow-xl z-50" data-popup={target}>
	<ul>
		<!-- Report user -->
		{#if selfUser}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={openReportUserModal}
				>
					<i class="fas fa-flag w-6 mr-2" />
					Report User
				</button>
			</li>
		{/if}
		<!-- Ban user (must be admin/mod, cannot ban admin, cannot ban yourself) -->
		{#if selfUser && ['administrator', 'moderator'].includes(selfUser.role ?? '') && profile.role !== 'administrator' && profile.id !== selfUser.id}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={openBanUserModal}
				>
					<i class="fa-solid fa-gavel w-6 mr-2" />
					Ban User
				</button>
			</li>
		{/if}
		<!-- Promote/demote user role (must be admin) -->
		{#if selfUser && selfUser.role === 'administrator'}
			{#if profile.role === 'authenticated'}
				<li>
					<button
						class="focus:outline-none w-full text-left"
						type="button"
						on:click={() => openChangeUserRoleModal(profile.role, 'moderator')}
					>
						<i class="fas fa-level-up-alt w-6 mr-2" />
						Promote user to Moderator
					</button>
				</li>
			{/if}
			{#if profile.role === 'moderator'}
				<li>
					<button
						class="focus:outline-none w-full text-left pr-5"
						type="button"
						on:click={() => openChangeUserRoleModal(profile.role, 'authenticated')}
					>
						<i class="fas fa-level-down-alt w-6 mr-2" />
						Demote user to Standard User
					</button>
				</li>
			{/if}
		{/if}
		<!-- Change member status (must be admin/mod) -->
		{#if selfUser && ['administrator', 'moderator'].includes(selfUser.role ?? '')}
			<li>
				<button
					class="focus:outline-none w-full text-left"
					type="button"
					on:click={openChangeMemberUntilModal}
				>
					<i class="fa-solid fa-street-view w-6 mr-2" />
					Update Member Status
				</button>
			</li>
		{/if}
	</ul>
</nav>
