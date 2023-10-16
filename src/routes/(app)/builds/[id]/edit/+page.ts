import { getBuildDetails, getMaybeBuildDetails, getSchematic } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const buildId = params.id;
	const build = await getMaybeBuildDetails(supabase, buildId);
	const schematic = await getSchematic(supabase, buildId);
	return { build, schematic };
};
