import { getMaybeBuildDetails, getSchematic } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const buildId = params.id;

	// Get build (if exists, user is editing the existing build)
	const [build, buildError] = await getMaybeBuildDetails(supabase, buildId);
	if (buildError) throw error(500, 'Failed to get build details.');

	// Get schematic (build ID == schematic ID)
	const [schematic, schematicError] = await getSchematic(supabase, buildId);
	if (schematicError?.code === 'PGRST116') throw error(404, 'Schematic not found!');
	if (schematicError) throw error(500, 'Failed to get schematic.');

	return { build, schematic };
};
