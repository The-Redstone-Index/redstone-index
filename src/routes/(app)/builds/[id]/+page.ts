import { getBuildDetails } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
	const buildId = params.id;
	const build = await getBuildDetails(supabase, buildId);

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
