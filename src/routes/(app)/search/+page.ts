import { getSearchedBuilds } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();

	const query = url.searchParams.get('query');
	const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;
	const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;
	// const tags = url.searchParams.get('tags')
	// const specs = url.searchParams.get('specs')
	// const sort = url.searchParams.get('sort')

	const [builds, error, count] = await getSearchedBuilds(supabase, query, offset, limit);
	if (error?.code === 'PGRST103') {
		const newSearchParams = url.searchParams;
		newSearchParams.set('offset', '0');
		throw redirect(303, `?${newSearchParams.toString()}`);
	}
	return { builds, count, query, offset, limit, error };
};
