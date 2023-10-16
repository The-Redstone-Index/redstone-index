import { getBuildDetails } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
	const buildId = params.id;

	// Get build
	const [build, buildError] = await getBuildDetails(supabase, buildId);
	if (buildError?.code === 'PGRST116') throw error(404, 'Build does not exist!');
	if (buildError) throw error(500, 'Failed to get build details.');

	// Get user liked status
	let userLiked = false;
	if (user) {
		const userLikeResp = await supabase
			.from('build_likes')
			.select('*')
			.eq('user_id', user.id)
			.maybeSingle();
		userLiked = !!userLikeResp.data;
	}

	return { build, userLiked };
};
