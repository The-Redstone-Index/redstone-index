import { getBuildDetails } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const buildId = params.id;
	const build = await getBuildDetails(supabase, buildId);
	return { build };
};
