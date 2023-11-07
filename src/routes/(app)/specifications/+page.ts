import { getSearchedSpecs, getSearchedTags } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();
	const [specs, specsError, count] = await getSearchedSpecs(supabase);
	if (specsError) throw error(500, 'Failed to get specifications.');
	return { specs, count };
};
