import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	throw error(404, 'Not Found');
};
