export function versionStringToInt(version: string) {
	const versionParts = version.split('.').map((part) => parseInt(part));
	const x = versionParts[0] * 1_000_000;
	const y = versionParts[1] * 1_000;
	const z = versionParts[2];
	return x + y + z;
}

export function versionIntToString(version: number) {
	const x = Math.floor((version % 1_000_000_000) / 1_000_000);
	const y = Math.floor((version % 1_000_000) / 1_000);
	const z = Math.floor(version % 1_000);
	return `${x}.${y}.${z}`;
}

export async function getAvatarUrl(supabase: SupabaseClient, storagePath: string) {
	try {
		const { data, error } = await supabase.storage.from('avatars').download(storagePath);
		if (error) throw error;
		return URL.createObjectURL(data);
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error downloading image:', error.message);
		}
	}
}

export function getUsernameErrorMessage(message: string) {
	switch (message) {
		case 'duplicate key value violates unique constraint "user_profiles_username_key"':
			return 'Sorry, this username is already taken. Please choose another.';
		case 'new row for relation "user_profiles" violates check constraint "username_length"':
			return 'Username must be at least 3 characters long.';
		case 'new row for relation "user_profiles" violates check constraint "username_pattern"':
			return 'Username can only contain letters, numbers, and underscores.';
		default:
			return message;
	}
}
