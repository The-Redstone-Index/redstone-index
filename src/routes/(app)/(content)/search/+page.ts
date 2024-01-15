import { getSearchedBuilds } from '$lib/supabase-api/builds';
import type {
	BuildSizeOption,
	ComparisonOpCode,
	SortConfig,
	SortingOption,
	SpecRequirement
} from '$lib/types';
import { versionStringToInt } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
	const { supabase } = await parent();

	const query = url.searchParams.get('query') ?? undefined;
	const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;
	const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;

	// e.g. tags=1+4+5+6
	const tagsParameter = url.searchParams.get('tags');
	const tagIds =
		tagsParameter
			?.split(' ')
			.map((id) => parseInt(id))
			.filter((id) => !isNaN(id)) ?? null;

	// e.g. specs=1_gt_42+2_eq_69+3_lt_1337
	const specsParameter = url.searchParams.get('specs');
	const specReqs: SpecRequirement[] | null =
		specsParameter
			?.split(' ')
			.map((itemStr) => {
				const [id, op, val] = itemStr.split('_');
				return { id: parseInt(id), op: op as ComparisonOpCode, val: parseFloat(val) };
			})
			.filter((itemObj) => !isNaN(itemObj.id))
			.filter((itemObj) => ['gt', 'eq', 'lt'].includes(itemObj.op))
			.filter((itemObj) => !isNaN(itemObj.val)) ?? null;

	// e.g. sort=likes_asc or sort=specification_desc_4
	const sortParameter: string | null = url.searchParams.get('sort');
	const sortArrayItems = sortParameter?.split('_');
	const sort: SortConfig | null = sortArrayItems
		? {
				by: sortArrayItems[0] as SortingOption,
				ascending: sortArrayItems[1] === 'asc',
				specId: parseInt(sortArrayItems[2])
		  }
		: null;

	// e.g. mcversion=3452
	const mcVersionParameter = url.searchParams.get('mcversion');
	const mcVersion: number | null = parseInt(mcVersionParameter ?? '') || null;

	// e.g. blocks=minecraft:sticky_piston+minecraft:white_wool
	const blocksIncluded: string[] | null = url.searchParams.get('blocks')?.split(' ') ?? null;

	// e.g. size=small
	const sizeCategory: BuildSizeOption | null = url.searchParams.get('size') as BuildSizeOption;

	// e.g. author=SuperPlasma
	const authorUsername: string | null = url.searchParams.get('author');

	// TODO: hidden filters
	// min_age=123123123&min_age=123123123
	// min_size=100&max_size=123

	const [builds, searchError, count] = await getSearchedBuilds(supabase, {
		search: query,
		offset,
		limit,
		tagIds: tagIds?.length ? tagIds : undefined,
		specReqs: specReqs?.length ? specReqs : undefined,
		mcVersion: mcVersion ? mcVersion : undefined,
		authorUsername: authorUsername ? authorUsername : undefined,
		sort: sort ? sort : undefined,
		sizeCategory: sizeCategory ? sizeCategory : undefined,
		blocksIncluded: blocksIncluded ? blocksIncluded : undefined
	});

	if (searchError?.code === 'PGRST103') {
		// If invalid range for pagination, then reset pagination
		const newSearchParams = url.searchParams;
		newSearchParams.set('offset', '0');
		throw redirect(303, `?${newSearchParams.toString()}`);
	}
	return {
		builds,
		count,
		offset,
		limit,
		error: searchError,
		filters: { tagIds, specReqs, mcVersion, sort, blocksIncluded, sizeCategory, authorUsername }
	};
};
