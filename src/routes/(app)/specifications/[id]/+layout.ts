import { getSpecDetails } from '$lib/api/specifications';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const [spec, specError] = await getSpecDetails(supabase, params.id);
	if (specError?.code === 'PGRST116') throw error(404, 'Specification does not exist!');
	if (specError) throw error(500, 'Failed to get specification.');
	return { spec };
};
