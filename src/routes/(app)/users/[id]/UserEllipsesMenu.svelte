<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let target: string;
	export let user: Tables<'users'>;

	const modalStore = getModalStore();

	function openReportUserModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Report User',
			body: 'Please provide a brief explanation of why you are reporting this user',
			valueAttr: { type: 'text', minlength: 3, maxlength: 1000, required: true },
			response: (r) => {
				if (r) {
					// TODO
					alert('FEATURE NOT IMPLEMENTED');
				}
			}
		});
	}

	function openBanUserModal() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Ban User',
			body: "Set a specific expiration date for the user's ban.",
			valueAttr: { type: 'date', required: true, min: new Date().toISOString().split('T')[0] },
			response: (r) => {
				if (r) {
					// TODO
					alert('FEATURE NOT IMPLEMENTED');
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
			response: (r) => {
				if (r) {
					// TODO
					alert('FEATURE NOT IMPLEMENTED');
				}
			}
		});
	}
</script>

<nav class="list-nav card p-1 shadow-xl z-50" data-popup={target}>
	<ul>
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
		<li>
			<button class="focus:outline-none w-full text-left" type="button" on:click={openBanUserModal}>
				<i class="fa-solid fa-gavel w-6 mr-2" />
				Ban User
			</button>
		</li>
		<li>
			<button
				class="focus:outline-none w-full text-left"
				type="button"
				on:click={() => openChangeUserRoleModal(user.role, 'moderator')}
			>
				<i class="fas fa-level-up-alt w-6 mr-2" />
				Promote user to Moderator
			</button>
		</li>
		<li>
			<button
				class="focus:outline-none w-full text-left pr-5"
				type="button"
				on:click={() => openChangeUserRoleModal(user.role, 'authenticated')}
			>
				<i class="fas fa-level-down-alt w-6 mr-2" />
				Demote user to Standard User
			</button>
		</li>
	</ul>
</nav>
