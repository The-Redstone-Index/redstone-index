import { getSearchedTags } from '$lib/supabase-api/tags';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();

	const query = url.searchParams.get('query');
	const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;
	const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;

	const [tags, error, count] = await getSearchedTags(supabase, { search: query, offset, limit });
	if (error?.code === 'PGRST103') {
		const newSearchParams = url.searchParams;
		newSearchParams.set('offset', '0');
		throw redirect(303, `?${newSearchParams.toString()}`);
	}
	return { tags, count, query, offset, limit, error };
};
