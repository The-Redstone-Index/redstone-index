export async function getSearchedSpecs(
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
		.from('specifications')
		.select('*', { count: 'estimated' })
		.range(offset, offset + limit - 1);

	// Text search
	if (search) query.textSearch('full_text_search', search, { type: 'plain' });

	// Sort by
	if (sortBy) query.order(sortBy, { ascending: sortAscending });
	query.order('name');

	const { data: tags, error, count } = await query;
	if (error) console.error(error);
	return [tags as unknown as Tables<'specifications'>[] | null, error, count as number] as const;
}

export async function getSpecDetails(supabase: SupabaseClient, specId: string) {
	const query = supabase
		.from('specifications')
		.select('*, author:users(*)')
		.eq('id', specId)
		.single();
	const { data: spec, error } = await query;
	if (error) console.error(error);
	return [spec as unknown as SpecificationDetails, error] as const;
}
