import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseClient } from '@supabase/supabase-js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Get input data
	const schemaData = await (await request.blob()).arrayBuffer();
	console.log(schemaData);
	const apiToken = request.headers.get('x-api-token');
	if (!apiToken) throw error(401, 'Invalid API token');
	console.log(apiToken);

	const supabase = new SupabaseClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

	// Handle API token
	const userSettingsRes = await supabase
		.from('user_settings')
		.select('*')
		.eq('api_token', apiToken)
		.single();
	if (userSettingsRes.error) throw error(401, 'Invalid API token');
	const userId = userSettingsRes.data.user_id;

	// Upload
	// !!!
	// TODO: Uploading a file fails with response:
	// 	error: {
	// 		message: 'Internal Server Error',
	// 		statusCode: '500',
	// 		error: 'internal'
	// 	}
	// !!!
	const uploadPath = `${userId}/${crypto.randomUUID()}.nbt`;
	const uploadRes = await supabase.storage.from('schematics').upload(uploadPath, schemaData);
	console.log('???');
	console.log(uploadRes);
	if (uploadRes.error) throw error(500, 'Failed to upload');
	console.log('???');

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
curl -X POST \
  -H "x-api-token: 2411864415018150" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@./static/piston_trapdoor.nbt" \
  http://localhost:5173/api/schematics

*/
