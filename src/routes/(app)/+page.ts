import { getRecentBuilds } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const recentBuilds = await getRecentBuilds(supabase);
	const popularBuilds: unknown = [];
	return {
		recentBuilds: (recentBuilds as unknown as BuildDetails[]) ?? [],
		popularBuilds: (popularBuilds as unknown as BuildDetails[]) ?? []
	};
};
