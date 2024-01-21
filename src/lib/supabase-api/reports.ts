export async function submitUserReport(
	supabase: SupabaseClient,
	info: {
		reporterUserId: string;
		reportedUserId: string;
		link: string;
		topic: string;
		reason: string;
	}
) {
	const { error } = await supabase.from('user_reports').insert({
		reporter_user_id: info.reporterUserId,
		reported_user_id: info.reportedUserId,
		link: info.link,
		reason: info.reason,
		topic: info.topic
	});
	return error;
}

export async function getUserReports(
	supabase: SupabaseClient,
	{
		dismissed = false,
		offset = 0,
		limit = 25
	}: { dismissed: boolean; offset?: number; limit?: number }
) {
	// Construct query
	const query = supabase
		.from('user_reports')
		.select('*, reporter_user:reporter_user_id(*), reported_user:reported_user_id(*)', {
			count: 'estimated'
		})
		.eq('dismissed', dismissed)
		.range(offset, offset + limit - 1);

	// Order by date
	query.order('created_at', { ascending: false });

	// Return results
	const { data, count, error } = await query;
	if (error) console.error(error);
	return [data as unknown as UserReportDetails[], error, count] as const;
}
