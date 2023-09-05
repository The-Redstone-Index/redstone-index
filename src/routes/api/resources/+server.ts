import { getResources } from '$lib/minecraft-rendering/mcmetaAPI';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const resources = await getResources();
		return json(resources);
	} catch (e) {
		console.warn(e);
		throw error(400, 'Failed to get versions');
	}
};
