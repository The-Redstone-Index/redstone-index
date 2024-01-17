export async function getComments(
	supabase: SupabaseClient,
	{ buildId, offset = 0, limit = 25 }: { buildId: number; offset?: number; limit?: number }
) {
	// 				author:users!builds_user_id_fkey(*),

	const { data, error } = await supabase
		.from('comments')
		.select('*,  author:users!user_id(*), parent:replying_to(*, author:users!user_id(*))')
		.eq('build_id', buildId)
		.range(offset, offset + limit - 1);
	if (error) console.error(error);
	return [data as unknown as CommentDetails[], error] as const;
}

export async function getSingleComment(supabase: SupabaseClient, id: number) {
	const { data, error } = await supabase
		.from('comments')
		.select('*,  author:users!user_id(*), parent:replying_to(*, author:users!user_id(*))')
		.eq('id', id)
		.single();
	if (error) console.error(error);
	return [data as unknown as CommentDetails, error] as const;
}
