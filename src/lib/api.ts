export function getAvatarUrl(supabase: SupabaseClient, objectPath: string | null) {
	if (!objectPath) return undefined;
	return supabase.storage.from('avatars').getPublicUrl(objectPath).data.publicUrl;
}

export async function getUserProfile(supabase: SupabaseClient, numericId: string) {
	const { data: profile } = await supabase
		.from('users')
		.select(
			'*, schematics(*, build:builds(*)), builds(*, author:users(*), schematic:schematics(*))'
		)
		.eq('numeric_id', numericId)
		.single();
	if (!profile) throw Error('Failed to get user profile');
	const { data: info } = await supabase.from('user_info').select('*').eq('id', profile.id).single();
	// (need to correct the type because profile.schematics.build is an object instead of an array)
	return { ...profile, info } as unknown as UserProfile;
}

export async function getSelfUser(supabase: SupabaseClient, id: string) {
	const { data: user } = await supabase
		.from('users')
		.select('*, private:users_private(*)')
		.eq('id', id)
		.single();
	if (!user) throw Error('Failed to get user details');
	const { data: info } = await supabase.from('user_info').select('*').eq('id', id).single();
	// (need to correct the type because 'private' is not an array in the response)
	return { ...user, info } as unknown as SelfUser;
}

export async function getBuildDetails(supabase: SupabaseClient, buildId: string) {
	const { data: build } = await supabase
		.from('builds')
		.select('*, schematic:schematics(*), author:users(*)')
		.eq('id', buildId)
		.single();
	if (!build) throw Error('Failed to get build details');
	// (need to correct the type because schematic and author should not be null)
	return build as BuildDetails;
}
