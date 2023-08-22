import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { supabase, session } = await parent();
	const { data } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single();
	return { profile: data };
};
