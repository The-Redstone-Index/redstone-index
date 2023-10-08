import { getSelfUser } from '$lib/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add user details to page data if exists
	const { supabase, session } = await parent();
	if (!session) return {};
	const user = await getSelfUser(supabase, session.user.id);
	return { user };
};
