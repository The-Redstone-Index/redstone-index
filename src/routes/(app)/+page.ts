import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const { data: recentBuilds } = await supabase
		.from('builds')
		.select('*, author:users(*), schematic:schematics(*)')
		.limit(15)
		.order('created_at', { ascending: false });
	const { data: popularBuilds } = await supabase
		.from('builds')
		.select('*, author:users(*), schematic:schematics(*)')
		.limit(15)
		.order('created_at', { ascending: false });
	return {
		recentBuilds: (recentBuilds as unknown as BuildDetails[]) ?? [],
		popularBuilds: (popularBuilds as unknown as BuildDetails[]) ?? []
	};
};
