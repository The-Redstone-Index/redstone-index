export const endpoint = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';

export interface MinecraftVersions {
	latest: Latest;
	versions: Version[];
}

export interface Latest {
	release: string;
	snapshot: string;
}

export interface Version {
	id: string;
	type: Type;
	url: string;
	time: string;
	releaseTime: string;
}

export enum Type {
	OldAlpha = 'old_alpha',
	OldBeta = 'old_beta',
	Release = 'release',
	Snapshot = 'snapshot'
}

export async function fetchMinecraftVersions(): Promise<MinecraftVersions> {
	const res = await fetch(endpoint);
	const json = await res.json();
	return json;
}
