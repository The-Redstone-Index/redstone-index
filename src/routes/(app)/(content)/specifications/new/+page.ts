import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	// Check user exists
	if (!user) throw error(403, 'User must be signed-in to create tags.');

	return { user };
};
