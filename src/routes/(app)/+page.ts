import { getRecentBuilds, getTrendingBuilds } from '$lib/supabase-api/builds';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const [recentBuilds] = await getRecentBuilds(supabase);
	const [trendingBuilds] = await getTrendingBuilds(supabase);
	return {
		recentBuilds: (recentBuilds as unknown as BuildDetails[]) ?? [],
		trendingBuilds: (trendingBuilds as unknown as BuildDetails[]) ?? []
	};
};
