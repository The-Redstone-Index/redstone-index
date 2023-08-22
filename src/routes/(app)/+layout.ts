import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add the user profile to page data if exists
	const { supabase, session } = await parent();
	const { data } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single();
	return { profile: data };
};
