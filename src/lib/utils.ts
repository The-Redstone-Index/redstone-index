import type { Session } from '@supabase/supabase-js';

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

export function enhanceTextView(element: HTMLElement) {
	// Users
	const userPattern = /@[a-zA-Z0-9_]+/gi;
	element.innerHTML = element.innerHTML.replaceAll(userPattern, (match) => {
		console.log(match);
		return `<a href="/users/${match}" class="anchor">` + match + '</a>';
	});

	// URLs
	var urlPattern =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
	element.innerHTML = element.innerHTML.replaceAll(urlPattern, (match) => {
		console.log(match);
		return `<a href="${match}" class="anchor">` + match + '</a>';
	});
}

export function isModeratorOrAdmin(session: Session | null) {
	return ['moderator', 'administrator'].includes(session?.user?.role ?? '');
}
