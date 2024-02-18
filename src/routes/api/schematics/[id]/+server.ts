import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase } = locals;

	// Params
	const id = params.id;

	// Query
	const res = await supabase
		.from('schematics')
		.select('id, created_at, author:users(numeric_id, username)')
		.eq('id', id);
	if (res.error) throw error(500, 'Failed to get schematic.');

	// Response
	return json(res.data);
};
