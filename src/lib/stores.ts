import { browser } from '$app/environment';
import { get, readable, writable } from 'svelte/store';
import { getBlockList, getResources, getVersionList } from './minecraft/mcmetaAPI';

interface MinecraftStore {
	resources: Awaited<ReturnType<typeof getResources>>;
	blockList: Awaited<ReturnType<typeof getBlockList>>;
	versionList: Awaited<ReturnType<typeof getVersionList>>;
	getVersionName(dataVersion: number): string | undefined;
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
					versionList,
					getVersionName: (dataVersion: number) =>
						get(store)?.versionList.find((v) => v.data_version === dataVersion)?.name
				});
			}
		);
	});

	return store;
}

export const minecraftStore = createMinecraftStore();

export const supabaseStore = writable<SupabaseClient>();
