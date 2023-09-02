import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { profile, session, settings, role } = await parent();
	if (!profile || !session || !settings || !role) throw redirect(302, '/');
	return { profile, session, settings, role };
};
