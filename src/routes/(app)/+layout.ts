import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add user details to page data if exists
	const { supabase, session } = await parent();
	if (!session) return {};
	// Note: output type of the function is incorrect and needs to be overiddenUser
	const { data } = await supabase
		.from('user_profiles_private')
		.select('*')
		.eq('id', session?.user.id)
		.maybeSingle();
	return { user: data as object as User };
};
