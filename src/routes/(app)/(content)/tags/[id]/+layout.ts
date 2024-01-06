import { getTagDetails } from '$lib/api/tags';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const [tag, tagError] = await getTagDetails(supabase, params.id);
	if (tagError?.code === 'PGRST116') throw error(404, 'Tag does not exist!');
	if (tagError) throw error(500, 'Failed to get tag.');
	return { tag };
};
