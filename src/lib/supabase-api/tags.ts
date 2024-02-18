export async function getTagDetails(supabase: SupabaseClient, tagId: string) {
	const query = supabase
		.from('tags')
		.select('*, parent:parent_id(*), author:users(*)')
		.eq('id', tagId)
		.single();
	const { data: tag, error } = await query;
	if (error) console.error(error);
	return [tag as unknown as TagDetails, error] as const;
}

export async function getSearchedTags(
	supabase: SupabaseClient,
	{
		search = null,
		offset = 0,
		limit = 50,
		sortBy = null,
		sortAscending = true
	}: {
		search?: string | null;
		offset?: number;
		limit?: number;
		sortBy?: 'usage_count' | 'created_at' | null;
		sortAscending?: boolean;
	}
) {
	const query = supabase
		.from('tags')
		.select('*, parent:parent_id(*), author:users(*)', { count: 'estimated' })
		.range(offset, offset + limit - 1);

	// Text search
	if (search) query.textSearch('full_text_search', search, { type: 'websearch' });

	// Sort by
	if (sortBy) query.order(sortBy, { ascending: sortAscending });
	query.order('name');

	const { data: tags, error, count } = await query;
	if (error) console.error(error);
	return [tags as unknown as Omit<TagDetails, 'author'>[] | null, error, count as number] as const;
}
