import { getMaybeBuildDetails, getSchematic } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
	const buildId = params.id;

	// Check user exists
	if (!user) throw error(403, 'User must be signed-in to edit builds.');

	// Get build (if exists, user is editing the existing build)
	const [build, buildError] = await getMaybeBuildDetails(supabase, buildId);
	if (buildError) throw error(500, 'Failed to get build details.');

	// Get schematic (build ID == schematic ID)
	const [schematic, schematicError] = await getSchematic(supabase, buildId);
	if (schematicError?.code === 'PGRST116') throw error(404, 'Schematic not found!');
	if (schematicError) throw error(500, 'Failed to get schematic.');

	// Check user permission
	if (schematic.user_id !== user.id) throw error(403, 'User cannot edit this build.');

	return { user, build, schematic, buildId: parseInt(buildId) };
};
