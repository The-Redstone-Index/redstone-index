import type { ComparisonOpCode } from './types';

export function getAvatarUrl(supabase: SupabaseClient, objectPath: string | null) {
	if (!objectPath) return undefined;
	return supabase.storage.from('avatars').getPublicUrl(objectPath).data.publicUrl;
}

export function getImageUrl(supabase: SupabaseClient, objectPath: string) {
	return supabase.storage.from('images').getPublicUrl(objectPath).data.publicUrl;
}

export async function getUserProfile(supabase: SupabaseClient, numericId: string) {
	const { data: profile, error } = await supabase
		.from('users')
		.select(
			`
				*,
				schematics(
					*,
					build:builds!builds_id_fkey(*),
					references:build_extra_schematics(*)
				),
				builds!builds_user_id_fkey(
					*,
					author:users!builds_user_id_fkey(*),
					schematic:schematics!builds_id_fkey(*)
				),
				likedBuilds:builds!build_likes(
					*,
					author:users!builds_user_id_fkey(*),
					schematic:schematics!builds_id_fkey(*)
				)
			`
		)
		.eq('numeric_id', numericId)
		.single();
	if (error) {
		console.error(error);
		return [null, error] as const;
	}
	const { data: info, error: error2 } = await supabase
		.from('user_info')
		.select('*')
		.eq('id', profile.id)
		.single();
	if (error2) {
		console.error(error2);
		return [null, error2] as const;
	}
	// (need to correct the type because profile.schematics.build is an object instead of an array)
	return [{ ...profile, info } as unknown as UserProfile, error2] as const;
}

export async function getSelfUser(supabase: SupabaseClient, id: string) {
	const { data: user, error } = await supabase
		.from('users')
		.select('*, private:users_private(*)')
		.eq('id', id)
		.single();
	if (error) console.error(error);
	const { data: info } = await supabase.from('user_info').select('*').eq('id', id).single();
	// (need to correct the type because 'private' is not an array in the response)
	return [{ ...user, info } as unknown as SelfUser, error] as const;
}

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

export async function getSchematic(supabase: SupabaseClient, schematicId: string) {
	const { data: schematic, error } = await supabase
		.from('schematics')
		.select('*')
		.eq('id', schematicId)
		.single();
	if (error) console.error(error);
	// (need to correct the type because schematic and author should not be null)
	return [schematic as Tables<'schematics'>, error] as const;
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

export async function getSearchedUsers(
	supabase: SupabaseClient,
	search: string | null = null,
	offset: number = 0,
	limit: number = 50
) {
	const query = supabase
		.from('users')
		.select('*', { count: 'estimated' })
		.range(offset, offset + limit - 1)
		.order('username', { ascending: true });
	if (search) query.ilike('username', `%${search}%`);
	const { data: tags, error, count } = await query;
	if (error) console.error(error);
	return [tags as unknown as Tables<'users'>[] | null, error, count as number] as const;
}

export async function getSearchedBuilds(
	supabase: SupabaseClient,
	{
		search = undefined,
		offset = 0,
		limit = 50,
		tagIds = undefined,
		specReqs = undefined,
		mcVersion = undefined
	}: {
		search?: string;
		offset?: number;
		limit?: number;
		tagIds?: number[];
		specReqs?: { id: number; op: ComparisonOpCode; val: number }[];
		mcVersion?: number;
	}
) {
	let query = supabase
		.from('builds')
		.select(
			[
				'*',
				'author:users!builds_user_id_fkey(*)',
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
		.range(offset, offset + limit - 1)
		.order('likes_count', { ascending: false });

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

	const { data: builds, error, count } = await query;
	if (error) console.error(error);
	return [builds as BuildDetails[] | null, error, count as number] as const;
}

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
