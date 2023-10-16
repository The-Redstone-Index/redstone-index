import { getUserProfile } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();
	const userNumericId = params.id;

	// Get user profile
	const [profile, profileError] = await getUserProfile(supabase, userNumericId);
	if (profileError?.code === 'PGRST116') throw error(404, 'User profile not found!');
	if (profileError) throw error(500, 'Failed to get user profile.');

	return { profile };
};
