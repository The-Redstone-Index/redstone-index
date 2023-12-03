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
	search: string | null = null,
	offset: number = 0,
	limit: number = 50
) {
	const query = supabase
		.from('tags')
		.select('*, parent:parent_id(*), author:users(*)', { count: 'estimated' })
		.range(offset, offset + limit - 1)
		.order('usage_count', { ascending: false })
		.order('name', { ascending: true });
	if (search) query.textSearch('full_text_search', search, { type: 'websearch' });
	const { data: tags, error, count } = await query;
	if (error) console.error(error);
	return [tags as unknown as Omit<TagDetails, 'author'>[] | null, error, count as number] as const;
}
