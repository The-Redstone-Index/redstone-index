import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add the user profile to page data if exists
	const { supabase, session } = await parent();
	const [profile, role, settings] = await Promise.all([
		supabase
			.from('user_profiles')
			.select('*')
			.eq('id', session?.user.id)
			.single()
			.then(({ data }) => data),
		supabase
			.from('user_roles')
			.select('*')
			.eq('id', session?.user.id)
			.single()
			.then(({ data }) => data),
		supabase
			.from('user_settings')
			.select('*')
			.eq('id', session?.user.id)
			.single()
			.then(({ data }) => data)
	]);
	return { profile, role, settings };
};
