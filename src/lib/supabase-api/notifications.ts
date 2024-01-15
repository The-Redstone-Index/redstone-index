import { invalidate, invalidateAll } from '$app/navigation';

export async function deleteNotification(supabase: SupabaseClient, id: number) {
	const { error } = await supabase.from('user_notifications').delete().eq('id', id);
	if (error) {
		console.error(error);
		return error;
	}
	invalidate((url) => {
		return url.pathname === '/rest/v1/user_notifications';
	});
}

export async function deleteAllNotifications(supabase: SupabaseClient, userId: string) {
	const { error } = await supabase.from('user_notifications').delete().eq('user_id', userId);
	if (error) {
		console.error(error);
		return error;
	}
	invalidate((url) => {
		return url.pathname === '/rest/v1/user_notifications';
	});
}
