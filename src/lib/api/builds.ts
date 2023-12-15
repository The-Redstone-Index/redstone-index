import { buildSizeOptions } from '$lib/config';
import type { BuildSizeOption, SortConfig, SpecRequirement } from '../types';

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
		sort = undefined,
		sizeCategory = undefined,
		blocksIncluded = undefined
	}: {
		search?: string;
		offset?: number;
		limit?: number;
		tagIds?: number[];
		specReqs?: SpecRequirement[];
		mcVersion?: number;
		authorUsername?: string;
		sort?: SortConfig;
		sizeCategory?: BuildSizeOption;
		blocksIncluded?: string[];
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
		query
			.lte('works_in_version_int', mcVersion)
			.or(`breaks_in_version_int.gt.${mcVersion}, breaks_in_version_int.is.null`);
	}

	// Author username
	if (authorUsername) {
		query.eq('author.username', authorUsername);
	}

	// Sort
	if (sort) {
		switch (sort.by) {
			case 'createddate':
				query.order('created_at', { ascending: sort.ascending });
				break;
			case 'likes':
				query.order('likes_count', { ascending: sort.ascending });
			case 'mcversion':
				query.order('works_in_version_int', { ascending: sort.ascending });
				break;
			case 'size':
				// TODO: Size
				break;
			case 'specification':
				query.order(`specifications->"${sort.specId}"`, { ascending: sort.ascending });
				query.not(`specifications->"${sort.specId}"`, 'is', null);
				break;
			// TODO: Trending
		}
	}
	query.order('likes_count', { ascending: false });

	// Size (by volume)
	if (sizeCategory) {
		const { minBlockCount, maxBlockCount } = buildSizeOptions[sizeCategory];
		if (minBlockCount) query.gte('volume', minBlockCount);
		if (maxBlockCount) query.lte('volume', maxBlockCount);
	}

	// Blocks included
	if (blocksIncluded) {
		blocksIncluded.forEach((blockName) => {
			query.not(`block_counts->"${blockName}"`, 'is', null);
		});
	}

	const { data: builds, error, count } = await query;
	if (error) console.error(error);
	return [builds as BuildDetails[] | null, error, count as number] as const;
}
