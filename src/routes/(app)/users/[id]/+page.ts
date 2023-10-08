import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();
	const userNumericId = params.id;
	const { data: profile } = await supabase
		.from('users')
		.select('*, schematics(*, builds(*)), builds(*)')
		.eq('numeric_id', userNumericId)
		.single();
	if (!profile) throw Error('Failed to get user profile');
	return {
		profile
	};
};
