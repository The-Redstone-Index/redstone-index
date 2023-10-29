import { getBuildDetails, getSearchedTagDetails } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const [tags, tagsError] = await getSearchedTagDetails(supabase);
	if (tagsError) throw error(500, 'Failed to get tags.');
	return { tags };
};
