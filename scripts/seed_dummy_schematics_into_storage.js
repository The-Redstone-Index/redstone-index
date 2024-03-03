import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as randomUUID } from 'uuid';

// Load env
config();

// Replace with your actual Supabase URL and Service Key
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const updateSchematics = async () => {
	// Query all rows from the schematics table that are still using placeholder schematic paths
	const { data: schematics, error } = await supabase
		.from('schematics')
		.select('*')
		.eq('object_path', 'dummy_object_path.nbt');

	if (error) {
		console.error('Error fetching schematics:', error);
		return;
	}

	// Loop through each schematic and update the object_path
	for (const schematic of schematics || []) {
		// Generate a new path using UUID
		const newPath = `${schematic.user_id}/${randomUUID()}.nbt`;

		// Upload a randomly selected .nbt file from the static folder
		const files = (await fs.readdir('static')).filter((n) => n.endsWith('.nbt'));
		const randomFile = files[Math.floor(Math.random() * files.length)];
		const filePath = join('static', randomFile);

		// Upload the schematic
		const schematicData = await fs.readFile(filePath);
		const { error: storageError } = await supabase.storage
			.from('schematics')
			.upload(newPath, schematicData);

		if (storageError) {
			console.error('Error uploading schematic:', storageError);
			continue;
		}

		// Update the row in the schematics table
		const { error: updateError } = await supabase
			.from('schematics')
			.update({ object_path: newPath })
			.eq('id', schematic.id);

		if (updateError) {
			console.error('Error updating schematic:', updateError);
		} else {
			console.log(`Schematic ${schematic.id} updated successfully.`);
		}
	}
};

// Run the updateSchematics function
updateSchematics();
