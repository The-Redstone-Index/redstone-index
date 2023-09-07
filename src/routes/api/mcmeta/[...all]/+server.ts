import { MCMETA_ENDPOINT } from '$lib/minecraft-rendering/mcmetaAPI';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const cacheTimeoutSeconds = 86400; // cache in browser for 1 day

export const GET: RequestHandler = async ({ params, fetch }) => {
	try {
		const response = await fetch(`${MCMETA_ENDPOINT}/${params.all}`);
		if (!response.ok) throw error(response.status, 'Failed to get resource');
		return new Response(response.body, {
			headers: { 'cache-control': `max-age=${cacheTimeoutSeconds}` }
		});
	} catch (e) {
		console.warn(e);
		throw error(400, 'Failed to get resource');
	}
};