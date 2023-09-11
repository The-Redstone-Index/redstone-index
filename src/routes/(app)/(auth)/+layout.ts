import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { supabase, session, user } = await parent();

	// If the database is reset, but you are still signed-in with a session,
	// you need to be signed-out so that the user does not get stuck.
	if (session && !user) {
		await supabase.auth.signOut();
	}

	// Redirect to home screen if you are already signed-in.
	if (session) {
		throw redirect(303, '/');
	}

	return {};
};
