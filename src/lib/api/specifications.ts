export async function getSearchedSpecs(
	supabase: SupabaseClient,
	search: string | null = null,
	offset: number = 0,
	limit: number = 50
) {
	const query = supabase
		.from('specifications')
		.select('*', { count: 'estimated' })
		.range(offset, offset + limit - 1)
		.order('usage_count', { ascending: false })
		.order('name', { ascending: true });
	if (search) query.textSearch('full_text_search', search, { type: 'websearch' });
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
