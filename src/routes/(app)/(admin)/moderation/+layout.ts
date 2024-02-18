import { isModeratorOrAdmin } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { supabase, session, user } = await parent();

	// If the database is reset, but you are still signed-in with a session,
	// you need to be signed-out so that the user does not get stuck.
	if (session && !user) {
		await supabase.auth.signOut();
	}

	// Check that the user is an admin or moderator
	if (!session || !isModeratorOrAdmin(session)) {
		throw error(403, 'User not authorized.');
	}

	return {};
};
