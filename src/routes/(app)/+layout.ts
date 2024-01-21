import { getSelfUser } from '$lib/supabase-api/users';
import { isBanned } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add user details to page data if exists
	const { supabase, session } = await parent();

	// Check session
	if (!session) return {};

	// Get self user details
	// (Continue even if there is an error)
	const [user] = await getSelfUser(supabase, session.user.id);

	// Sign out the user if they are banned
	if (user && isBanned(user)) {
		supabase.auth.signOut();
	}

	return { user };
};
