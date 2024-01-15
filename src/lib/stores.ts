import { browser } from '$app/environment';
import { get, readable, writable } from 'svelte/store';
import { getBlockList, getResources, getVersionList } from './minecraft/mcmetaAPI';

interface MinecraftStore {
	resources: Awaited<ReturnType<typeof getResources>>;
	blockList: Awaited<ReturnType<typeof getBlockList>>;
	versionList: Awaited<ReturnType<typeof getVersionList>>;
}

function createMinecraftStore() {
	const store = readable<null | MinecraftStore>(null, (set) => {
		// Do not fetch on server
		if (!browser) return;
		// Fetch Minecraft data
		Promise.all([getResources(), getBlockList(), getVersionList()]).then(
			([resources, blockList, versionList]) => {
				set({
					resources,
					blockList,
					versionList
				});
			}
		);
	});

	return store;
}

export const minecraftStore = createMinecraftStore();

export const supabaseStore = writable<SupabaseClient>();
