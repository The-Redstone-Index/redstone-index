import { getUserProfile } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();
	const userNumericId = params.id;
	const profile = await getUserProfile(supabase, userNumericId);
	return { profile };
};
