export async function getSchematic(supabase: SupabaseClient, schematicId: string) {
	const { data: schematic, error } = await supabase
		.from('schematics')
		.select('*')
		.eq('id', schematicId)
		.single();
	if (error) console.error(error);
	// (need to correct the type because schematic and author should not be null)
	return [schematic as Tables<'schematics'>, error] as const;
}
