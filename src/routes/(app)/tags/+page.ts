import { getSearchedTags } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();
	const [tags, tagsError, count] = await getSearchedTags(supabase);
	if (tagsError) throw error(500, 'Failed to get tags.');
	return { tags, count };
};
