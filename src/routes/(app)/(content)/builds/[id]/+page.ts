import { getBuildDetails } from '$lib/supabase-api/builds';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, url }) => {
	const { supabase, user } = await parent();
	const buildId = params.id;

	const highlightedCommentId = parseInt(url.searchParams.get('comment') ?? '') || undefined;

	// Get build
	const [build, buildError] = await getBuildDetails(supabase, buildId);
	if (buildError?.code === 'PGRST116') throw error(404, 'Build does not exist!');
	if (buildError) throw error(500, 'Failed to get build details.');

	// Get user liked and commented status
	let userLiked = false;
	let userCommented = false;
	if (user) {
		const userLikeResp = await supabase
			.from('build_likes')
			.select('*', { head: true, count: 'estimated' })
			.eq('user_id', user.id)
			.eq('build_id', buildId);
		userLiked = !!userLikeResp.count;
		const userCommentResp = await supabase
			.from('comments')
			.select('*', { head: true, count: 'estimated' })
			.eq('user_id', user.id)
			.eq('build_id', buildId);
		userCommented = !!userCommentResp.count;
	}

	return { build, userLiked, userCommented, highlightedCommentId };
};
