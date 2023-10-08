import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const buildId = params.id;
	const { data: build } = await supabase
		.from('builds')
		.select('*, schematic:schematics(*), author:users(*)')
		.eq('id', buildId)
		.single();
	if (!build) throw Error('Failed to get build details');
	// (need to correct the type because schematic and author should not be null)
	return { build: build as BuildDetails };
};
