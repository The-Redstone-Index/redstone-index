import { getSearchedTags } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();

	const query = url.searchParams.get('query');
	const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;
	const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;

	const [tags, error, count] = await getSearchedTags(supabase, query, offset, limit);
	return { tags, count, query, offset, limit, error };
};