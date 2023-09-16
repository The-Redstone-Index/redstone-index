import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase } = locals;
	const { id } = params;

	const dbResponse = await supabase.from('schematics').select('*').eq('id', id).single();
	if (dbResponse.error) throw error(dbResponse.status, 'Schematic not found');
	const { data: schematic } = dbResponse;

	const storageResponse = await supabase.storage.from('schematics').download(schematic.object_path);
	if (storageResponse.error) throw error(dbResponse.status, 'Schematic not found');
	const { data: schematicData } = storageResponse;
	return new Response(schematicData, {
		headers: {
			'Content-Disposition': `attachment; filename="schematic_${id}.nbt"`
		}
	});
};
