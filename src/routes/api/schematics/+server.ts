import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = locals;

	// Params
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	const username = url.searchParams.get('username') ?? null;

	// Query
	const query = supabase
		.from('schematics')
		.select('id, created_at, author:users!inner(numeric_id, username)')
		.range(offset, offset + limit - 1);
	if (username) {
		query.eq('users.username', username);
	}
	// Response
	const res = await query;
	if (res.error) throw error(500, 'Failed to get schematics.');
	return json(res.data);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { supabase } = locals;

	// Get input data
	const schemaData = await request.blob();
	const apiToken = request.headers.get('x-api-token');
	if (!apiToken) throw error(401, 'Invalid API token');

	// Handle API token
	const userSettingsRes = await supabase
		.from('users_private')
		.select('*')
		.eq('api_token', apiToken)
		.single();
	if (userSettingsRes.error) throw error(401, 'Invalid API token');
	if (!userSettingsRes.data) throw error(404, 'User not found');
	const userId = userSettingsRes.data.id;

	// Upload
	const uploadPath = `${userId}/${crypto.randomUUID()}.nbt`;
	const uploadRes = await supabase.storage.from('schematics').upload(uploadPath, schemaData);

	// NOTE: Rate limiting is done via trigger on public.schematics table
	if (uploadRes.error) {
		const { count } = await supabase
			.from('schematics')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId);
		if (count ?? 0 > 2) {
			throw error(500, 'Failed to upload. Possibly be due to rate limit.');
		}
		throw error(500, 'Failed to upload');
	}

	// Response
	const resultRes = await supabase
		.from('schematics')
		.select('*')
		.eq('user_id', userId)
		.eq('object_path', uploadPath)
		.single();
	if (resultRes.error) throw error(500, 'Failed to get info after upload');
	return json(
		{ success: true, id: resultRes.data.id },
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization'
			}
		}
	);
};

/*
e.g.
curl -X POST \
  -H "x-api-token: 9417210271194205" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@./static/piston_trapdoor.nbt" \
  http://localhost:5173/api/schematics
*/
