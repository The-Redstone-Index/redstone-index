import { fetchMinecraftVersions } from '$lib/minecraft-versions/versionsAPI';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const versions = await fetchMinecraftVersions();
		return json(versions);
	} catch (e) {
		console.warn(e);
		throw error(400, 'Failed to get versions');
	}
};
