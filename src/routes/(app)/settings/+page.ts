import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { profile } = await parent();
	if (!profile) throw redirect(302, '/');
	return { profile };
};
