import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { getSession } = locals;
	const session = await getSession();

	if (session) {
		throw redirect(303, '/');
	}

	return {};
};
