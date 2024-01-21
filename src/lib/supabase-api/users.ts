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
	// (need to correct the type because profile.schematics.build is an object instead of an array)
	return [profile as unknown as UserProfile, error] as const;
}

export async function getSelfUser(supabase: SupabaseClient, id: string) {
	const { data: user, error } = await supabase
		.from('users')
		.select('*, private:users_private(*), notifications:user_notifications(*)')
		.eq('id', id)
		.single();
	if (error) console.error(error);
	// (need to correct the type because 'private' is not an array in the response)
	return [user as unknown as SelfUser, error] as const;
}

export async function getSearchedUsers(
	supabase: SupabaseClient,
	{
		search = undefined,
		offset = 0,
		limit = 50,
		role = undefined
	}: {
		search?: string;
		offset: number;
		limit: number;
		role?: string;
	}
) {
	const query = supabase
		.from('users')
		.select('*', { count: 'estimated' })
		.range(offset, offset + limit - 1)
		.order('username', { ascending: true });
	if (search) query.ilike('username', `%${search}%`);
	if (role) query.eq('role', role);
	const { data: tags, error, count } = await query;
	if (error) console.error(error);
	return [tags as unknown as Tables<'users'>[] | null, error, count as number] as const;
}
