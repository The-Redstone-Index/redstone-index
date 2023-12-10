import type { ComparisonOpCode, SortingOption, SpecRequirement } from '../types';

export async function getBuildDetails(supabase: SupabaseClient, buildId: string) {
	const { data: build, error } = await supabase
		.from('builds')
		.select(
			`
				*,
				author:users!builds_user_id_fkey(*),
				schematic:schematics!builds_id_fkey(*),
				extraSchematics:schematics!build_extra_schematics(*),
				buildTags:tags(*)
			`
		)
		.eq('id', buildId)
		.single();
	if (error) console.error(error);
	// (need to correct the type because schematic and author should not be null)
	return [build as BuildDetails, error] as const;
}

export async function getMaybeBuildDetails(supabase: SupabaseClient, buildId: string) {
	const { data: build, error } = await supabase
		.from('builds')
		.select(
			`
				*,
				author:users!builds_user_id_fkey(*),
				schematic:schematics!builds_id_fkey(*),
				extraSchematics:schematics!build_extra_schematics(*),
				buildTags:tags(*)
			`
		)
		.eq('id', buildId)
		.maybeSingle();
	if (error) console.error(error);
	// (need to correct the type because schematic and author should not be null)
	return [build as BuildDetails | null, error] as const;
}

export async function getRecentBuilds(supabase: SupabaseClient) {
	const { data: recentBuilds, error } = await supabase
		.from('builds')
		.select('*, author:users!builds_user_id_fkey(*), schematic:schematics!builds_id_fkey(*)')
		.limit(15)
		.order('created_at', { ascending: false });
	if (error) console.error(error);
	return [recentBuilds as BuildDetails[], error] as const;
}

export async function getSearchedBuilds(
	supabase: SupabaseClient,
	{
		search = undefined,
		offset = 0,
		limit = 50,
		tagIds = undefined,
		specReqs = undefined,
		mcVersion = undefined,
		authorUsername = undefined,
		sortBy = undefined,
		sortAscending = true,
		sortBySpecId = undefined
	}: {
		search?: string;
		offset?: number;
		limit?: number;
		tagIds?: number[];
		specReqs?: SpecRequirement[];
		mcVersion?: number;
		authorUsername?: string;
		sortBy?: SortingOption;
		sortAscending?: boolean;
		sortBySpecId?: number;
	}
) {
	let query = supabase
		.from('builds')
		.select(
			[
				'*',
				'author:users!builds_user_id_fkey!inner(*)',
				'schematic:schematics!builds_id_fkey(*)',
				tagIds ? 'build_tags!inner(*)' : null,
				specReqs ? 'build_specifications!inner(*)' : null
			]
				.filter((v) => v)
				.join(', '),
			{
				count: 'estimated'
			}
		)
		.range(offset, offset + limit - 1);

	// Text search
	if (search) {
		query.textSearch('full_text_search', search, { type: 'websearch' });
	}

	// Tags required filter
	if (tagIds) {
		query.contains('tags', tagIds);
	}

	// Specification requirements filters
	if (specReqs) {
		specReqs.forEach(({ id, op, val }) => {
			if (val === undefined) return;
			switch (op) {
				case 'gt':
					return query.gt(`specifications->"${id}"`, val);
				case 'eq':
					return query.eq(`specifications->"${id}"`, val);
				case 'lt':
					return query.lt(`specifications->"${id}"`, val);
			}
		});
	}

	// Minecraft version filter (working =< version < breaking)
	if (mcVersion) {
		query.lte('works_in_version_int', mcVersion).gt('breaks_in_version_int', mcVersion);
	}

	// Author username
	if (authorUsername) {
		query.eq('author.username', authorUsername);
	}

	// Sort
	if (typeof sortBy === 'string') {
		switch (sortBy) {
			case 'createddate':
				query.order('created_at', { ascending: sortAscending });
				break;
			case 'likes':
				query.order('likes_count', { ascending: sortAscending });
			case 'mcversion':
				query.order('works_in_version_int', { ascending: sortAscending });
				break;
			case 'size':
				break;
		}
	} else {
		query.order(`specifications->"${sortBy}"`, { ascending: sortAscending });
	}
	query.order('likes_count', { ascending: false });

	const { data: builds, error, count } = await query;
	if (error) console.error(error);
	return [builds as BuildDetails[] | null, error, count as number] as const;
}
