import { getSearchedBuilds } from '$lib/api';
import type { ComparisonOpCode, SearchSpecReq } from '$lib/types';
import { versionStringToInt } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();

	const query = url.searchParams.get('query') ?? undefined;
	const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;
	const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;
	const tagIds =
		url.searchParams
			.get('tags')
			?.split(' ')
			.map((id) => parseInt(id))
			.filter((id) => !isNaN(id)) ?? null;
	const specReqs: SearchSpecReq[] | null =
		url.searchParams
			.get('specs')
			?.split(' ')
			.map((itemStr) => {
				const [id, op, val] = itemStr.split('_');
				return { id: parseInt(id), op: op as ComparisonOpCode, val: parseFloat(val) };
			})
			.filter((itemObj) => !isNaN(itemObj.id))
			.filter((itemObj) => ['gt', 'eq', 'lt'].includes(itemObj.op))
			.filter((itemObj) => !isNaN(itemObj.val)) ?? null;
	const sortBy: string | null = url.searchParams.get('sort');
	const mcVersion: number | null =
		versionStringToInt(url.searchParams.get('mcversion') ?? '') || null;
	const blocksIncluded: string[] | null = url.searchParams.get('blocks')?.split(' ') ?? null;
	const sizeCategory: string | null = url.searchParams.get('size');

	const [builds, error, count] = await getSearchedBuilds(supabase, {
		search: query,
		offset,
		limit,
		tagIds: tagIds?.length ? tagIds : undefined,
		specReqs: specReqs?.length ? specReqs : undefined,
		mcVersion: mcVersion ? mcVersion : undefined
	});

	if (error?.code === 'PGRST103') {
		const newSearchParams = url.searchParams;
		newSearchParams.set('offset', '0');
		throw redirect(303, `?${newSearchParams.toString()}`);
	}
	return {
		builds,
		count,
		offset,
		limit,
		error,
		filters: { tagIds, specReqs, mcVersion, sortBy, blocksIncluded, sizeCategory }
	};
};
