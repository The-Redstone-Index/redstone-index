import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user, session } = await parent();
	if (!user || !session) throw redirect(302, '/');
	return { user, session };
};
