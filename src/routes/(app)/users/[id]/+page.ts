import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, user } = await parent();
	const { data: schematics } = await supabase
		.from('schematics')
		.select('*')
		.eq('user_id', user?.id);
	if (!schematics || !user) throw Error('Failed');
	return { user, schematics };
};
