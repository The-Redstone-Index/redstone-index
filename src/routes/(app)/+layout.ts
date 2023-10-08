import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Add user details to page data if exists
	const { supabase, session } = await parent();
	if (!session) return {};
	const { data: user } = await supabase
		.from('users')
		.select('*, private:users_private(*)')
		.eq('id', session?.user.id)
		.single();
	if (!user) throw Error('Failed to get user details');
	// (need to correct the type because 'private' is not an array in the response)
	return { user: user as unknown as SelfUser };
};
