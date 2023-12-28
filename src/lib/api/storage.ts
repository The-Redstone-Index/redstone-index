export function getAvatarUrl(supabase: SupabaseClient, objectPath: string | null) {
	if (!objectPath) return undefined;
	return supabase.storage.from('avatars').getPublicUrl(objectPath).data.publicUrl;
}

export function getImageUrl(supabase: SupabaseClient, objectPath: string) {
	return supabase.storage.from('images').getPublicUrl(objectPath).data.publicUrl;
}
