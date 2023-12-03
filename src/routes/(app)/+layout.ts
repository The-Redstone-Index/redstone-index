import { getSelfUser } from '$lib/api/users';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add user details to page data if exists
	const { supabase, session } = await parent();

	// Check session
	if (!session) return {};

	// Get self user details
	const [user] = await getSelfUser(supabase, session.user.id);
	// Continue even if there is an error

	return { user };
};
