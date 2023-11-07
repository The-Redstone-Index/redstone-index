import { getSearchedBuilds } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();
	const query = url.searchParams.get('query');
	// const tags = url.searchParams.get('tags')
	// const specs = url.searchParams.get('specs')
	// const sort = url.searchParams.get('sort')
	const [builds, buildsError, count] = await getSearchedBuilds(supabase, query);
	if (buildsError) throw error(500, 'Failed to get builds.');
	return { builds, count };
};
