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
