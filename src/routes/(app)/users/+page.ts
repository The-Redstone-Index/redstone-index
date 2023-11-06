import { getSearchedUsers } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const [users, usersError, count] = await getSearchedUsers(supabase);
	if (usersError) throw error(500, 'Failed to get users.');
	return { users, count };
};
