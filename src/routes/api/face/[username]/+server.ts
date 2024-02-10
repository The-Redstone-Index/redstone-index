import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	try {
		const username = params.username;
		const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`, {
			headers: { 'User-Agent': 'test' }
		});
		if (!response.ok) {
			console.error('Mojang API Error:', response.status, response.statusText);
			if (response.status === 404) throw error(response.status, 'Minecraft face does not exist');
			throw error(response.status, 'Failed to get Mojang resource');
		}
		const userDetails: { id: string } = await response.json();
		const userId = userDetails.id;
		const faceUrl = `https://crafatar.com/avatars/${userId}?overlay=true`;
		const faceResponse = await fetch(faceUrl);
		if (!faceResponse.ok) {
			console.error('Crafatar API Error:', faceResponse.status, faceResponse.statusText);
			throw error(faceResponse.status, 'Failed to get Crafatar resource');
		}
		return faceResponse;
	} catch (e) {
		console.error('Internal Error:', e);
		throw error(500, 'Failed to get resource');
	}
};
