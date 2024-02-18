import type { Session } from '@supabase/supabase-js';

export function versionStringToInt(version: string) {
	const versionParts = version.split('.').map((part) => parseInt(part));
	const x = versionParts[0] * 1_000_000;
	const y = (versionParts[1] ?? 0) * 1_000;
	const z = versionParts[2] ?? 0;
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
	// URLs
	var urlPattern =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
	element.innerHTML = element.innerHTML.replaceAll(urlPattern, (match) => {
		return `<a href="${match}" class="anchor">` + match + '</a>';
	});
}

export function isModeratorOrAdmin(session: Session | null) {
	return ['moderator', 'administrator'].includes(session?.user?.role ?? '');
}

export const formatNumberCompact = Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 1
}).format;

export function matchSearchTerms(targetString: string, searchString: string) {
	const searchTerms = searchString.toLowerCase().split(' ');
	return searchTerms.every((term) => targetString.toLowerCase().includes(term));
}

export function formatCommentDate(date: Date) {
	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	// Return string format
	if (isSameDay(date, now)) return 'Today @ ' + formatTime(date);
	else if (isSameDay(date, yesterday)) return 'Yesterday @ ' + formatTime(date);
	else return formatDateFull(date);

	function isSameDay(date1: Date, date2: Date) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
	function formatTime(date: Date) {
		return date
			.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
			.toUpperCase();
	}
	function formatDateFull(date: Date) {
		return date
			.toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			})
			.toUpperCase();
	}
}

export function getRoleShortName(role: string) {
	switch (role) {
		case 'administrator':
			return 'ADMIN';
		case 'moderator':
			return 'MOD';
		case 'authenticated':
			return 'USER';
		default:
			return '???';
	}
}

export function isMember(user: Tables<'users'>): boolean {
	return !!(user.member_until && new Date(user.member_until) > new Date());
}

export function isBanned(user: Tables<'users'>): boolean {
	return !!(user.banned_until && new Date(user.banned_until) > new Date());
}
