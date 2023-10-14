export function getAvatarUrl(supabase: SupabaseClient, objectPath: string | null) {
	if (!objectPath) return undefined;
	return supabase.storage.from('avatars').getPublicUrl(objectPath).data.publicUrl;
}

export async function getUserProfile(supabase: SupabaseClient, numericId: string) {
	const { data: profile, error } = await supabase
		.from('users')
		.select(
			'*, schematics(*, build:builds(*)), builds!builds_user_id_fkey(*, author:users!builds_user_id_fkey(*), schematic:schematics(*))'
		)
		.eq('numeric_id', numericId)
		.single();
	if (error) console.error(error);
	if (!profile) throw Error('Failed to get user profile');
	const { data: info } = await supabase.from('user_info').select('*').eq('id', profile.id).single();
	// (need to correct the type because profile.schematics.build is an object instead of an array)
	return { ...profile, info } as unknown as UserProfile;
}

export async function getSelfUser(supabase: SupabaseClient, id: string) {
	const { data: user, error } = await supabase
		.from('users')
		.select('*, private:users_private(*)')
		.eq('id', id)
		.single();
	if (error) console.error(error);
	if (!user) throw Error('Failed to get user details');
	const { data: info } = await supabase.from('user_info').select('*').eq('id', id).single();
	// (need to correct the type because 'private' is not an array in the response)
	return { ...user, info } as unknown as SelfUser;
}

export async function getBuildDetails(supabase: SupabaseClient, buildId: string) {
	const { data: build, error } = await supabase
		.from('builds')
		.select('*, author:users!builds_user_id_fkey(*), schematic:schematics(*)')
		.eq('id', buildId)
		.single();
	if (error) console.error(error);
	if (!build) throw Error('Failed to get build details');
	// (need to correct the type because schematic and author should not be null)
	return build as BuildDetails;
}

export async function getRecentBuilds(supabase: SupabaseClient) {
	const { data: recentBuilds, error } = await supabase
		.from('builds')
		.select('*, author:users!builds_user_id_fkey(*), schematic:schematics(*)')
		.limit(15)
		.order('created_at', { ascending: false });
	if (error) console.error(error);
	if (!recentBuilds) throw Error('Failed to get recent build');
	return recentBuilds as BuildDetails[];
}
