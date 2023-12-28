import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	try {
		const username = params.username;
		const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
		if (!response.ok) throw error(response.status, 'Failed to get resource');
		const userDetails: { id: string } = await response.json();
		const userId = userDetails.id;
		const faceUrl = `https://crafatar.com/avatars/${userId}?overlay=true`;
		const faceResponse = await fetch(faceUrl);
		return faceResponse;
	} catch (e) {
		console.warn(e);
		throw error(400, 'Minecraft face does not exist');
	}
};
