import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, profile } = await parent();
	const { data: schematics } = await supabase
		.from('schematics')
		.select('*')
		.eq('user_id', profile?.id);
	if (!schematics || !profile) throw Error('Failed');
	return { profile, schematics };
};
