import { browser } from '$app/environment';
import { get, readable, writable } from 'svelte/store';
import { getBlockList, getResources, getVersionList } from './minecraft/mcmetaAPI';

async function createMinecraftStore() {
	if (!browser) return null;
	const resources = await getResources();
	const blockList = await getBlockList();
	const versionList = await getVersionList();
	const store = readable({
		resources,
		blockList,
		versionList
	});

	function getVersionName(dataVersion: number) {
		const version = get(store).versionList.find((v) => v.data_version === dataVersion);
		return version?.name;
	}

	return {
		...store,
		getVersionName
	};
}

export const minecraftStore = await createMinecraftStore();

export const supabaseStore = writable<SupabaseClient>();
