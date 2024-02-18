import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();
	const { data: schematic } = await supabase
		.from('schematics')
		.select('*')
		.eq('id', params.id)
		.single();
	if (!schematic) throw error(404, 'Schematic not found');
	return { schematic };
};
