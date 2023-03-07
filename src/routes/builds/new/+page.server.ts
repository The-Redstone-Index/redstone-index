import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const type = data.get('build-type');
		const title = data.get('title');
		const description = data.get('description');
		const schematic = data.get('schematic-upload') as File;
		const photos = data.getAll('photos-upload') as File[];
		const tags = data.get('tags');

		// const schematicAb = schematic.arrayBuffer();
		// console.log(Array.from(schematicAb));
		// console.log(typeof schematic);
		console.log(schematic.stream());

		console.log({
			type,
			title,
			description,
			schematic,
			photos,
			tags
		});

		return { success: true };
	}
} satisfies Actions;
