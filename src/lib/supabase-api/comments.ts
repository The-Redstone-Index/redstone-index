export async function getComments(
	supabase: SupabaseClient,
	{ buildId, offset = 0, limit = 25 }: { buildId: number; offset?: number; limit?: number }
) {
	// Construct query
	const query = supabase
		.from('comments')
		.select('*,  author:users!user_id(*), parent:replying_to(*, author:users!user_id(*))', {
			count: 'estimated'
		})
		.eq('build_id', buildId)
		.range(offset, offset + limit - 1);

	// Order by date
	query.order('created_at', { ascending: false });

	// Return results
	const { data, count, error } = await query;
	if (error) console.error(error);
	console.log(count);
	return [data as unknown as CommentDetails[], error, count] as const;
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

export async function deleteComment(supabase: SupabaseClient, comment: CommentDetails) {
	const { error } = await supabase
		.from('comments')
		.update({ deleted: !comment.deleted })
		.eq('id', comment.id);
	if (error) {
		console.error(error);
		return error;
	}
}
