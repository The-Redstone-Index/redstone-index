import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { profile, session } = await parent();
	if (!profile || !session) throw redirect(302, '/');
	return { profile, session };
};
