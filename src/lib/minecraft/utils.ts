import {
	NbtCompound,
	NbtFile,
	NbtFloat,
	NbtInt,
	NbtList,
	NbtString,
	NbtTag,
	Structure,
	type PlacedBlock
} from 'deepslate';

export async function getStructureHash(schemaData: ArrayBuffer) {
	/*
	 * 1. Crop dimensions to build in case there is empty air blocks surrounding the build
	 */
	const croppedSchemaData = getCroppedStructure(schemaData);
	const schemaFile = NbtFile.read(new Uint8Array(croppedSchemaData));
	const structure = Structure.fromNbt(schemaFile.root);

	/*
	 * 2. Convert schematic into 1D array of blocks
	 * - x (0 to Xmax), y (0 to Ymax), z (0 to Zmax)
	 * - x (Xmax to 0), y (0 to Ymax), z (0 to Zmax)
	 * - x (0 to Xmax), y (0 to Ymax), z (Zmax to 0)
	 * - x (Xmax to 0), y (0 to Ymax), z (Zmax to 0)
	 */
	const size = structure.getSize();
	const blockArrays: (PlacedBlock | null)[][] = [[], [], [], []];
	for (let i = 0; i <= size[0]; i++) {
		for (let j = 0; j <= size[1]; j++) {
			for (let k = 0; k <= size[2]; k++) {
				blockArrays[0].push(structure.getBlock([i, j, k]));
				blockArrays[1].push(structure.getBlock([size[0] - i - 1, j, k]));
				blockArrays[2].push(structure.getBlock([i, j, size[2] - k - 1]));
				blockArrays[3].push(structure.getBlock([size[0] - i - 1, j, size[2] - k - 1]));
			}
		}
	}

	/*
	 *	3. Stringify the array and get a hash for each array
	 */

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const blockArrayStrings = blockArrays.map((arr) => arr.map((b) => b?.state.name.path ?? 'air'));

	/*
	 * 4. The largest hash is the hash that will be used for the schematic
	 */
	const blockArrayHashes = await Promise.all(blockArrayStrings.map(hashStringArray));
	const maxHash = blockArrayHashes.reduce((max, hash) => {
		return hash > max ? hash : max;
	}, '');
	return maxHash;
}

async function hashStringArray(stringArray: string[]) {
	const encoder = new TextEncoder();
	const concatenatedString = stringArray.join(''); // Concatenate the strings
	const data = encoder.encode(concatenatedString); // Convert the concatenated string to Uint8Array
	const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Generate the hash buffer
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert the buffer to an array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hexadecimal
	return hashHex;
}

export function getStructureSize(schemaData: ArrayBuffer) {
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	const size = structure.getSize();
	return { x: size[0], y: size[1], z: size[2] };
}

export function getStructureBlockList(schemaData: ArrayBuffer) {
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	const blocks = structure.getBlocks();
	const blockList: { [key: string]: number } = {};
	blocks.forEach((b) => {
		const state = b.state;
		const name: string = state.getName().path;
		if (name === 'air' || !name) return;
		blockList[name] = blockList[name] ? blockList[name] + 1 : 1;
	});
	return blockList;
}

export function getCroppedStructureSize(schemaData: ArrayBuffer) {
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	let minX = Infinity,
		minY = Infinity,
		minZ = Infinity;
	let maxX = -Infinity,
		maxY = -Infinity,
		maxZ = -Infinity;
	const blocks = structure.getBlocks();
	if (blocks.length === 0) {
		return {
			x: 0,
			y: 0,
			z: 0,
			maxX: 0,
			minX: 0,
			maxY: 0,
			minY: 0,
			maxZ: 0,
			minZ: 0
		};
	}
	blocks.forEach((b) => {
		minX = Math.min(b.pos[0], minX);
		minY = Math.min(b.pos[1], minY);
		minZ = Math.min(b.pos[2], minZ);
		maxX = Math.max(b.pos[0], maxX);
		maxY = Math.max(b.pos[1], maxY);
		maxZ = Math.max(b.pos[2], maxZ);
	});
	return {
		x: maxX - minX + 1,
		y: maxY - minY + 1,
		z: maxZ - minZ + 1,
		maxX,
		minX,
		maxY,
		minY,
		maxZ,
		minZ
	};
}

export function getCroppedStructure(schemaData: ArrayBuffer) {
	const cropInfo = getCroppedStructureSize(schemaData);

	// Edit existing structure
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	structure.blocks.forEach((b) => {
		b.pos[0] -= cropInfo.minX;
		b.pos[1] -= cropInfo.minY;
		b.pos[2] -= cropInfo.minZ;
	});
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	structure.size = [cropInfo.x, cropInfo.y, cropInfo.z];

	// Construct new file
	const file = structureToNBTFile(structure);
	const buff = file.write().buffer;
	return buff;
}
function structureToNBTFile(structure: Structure) {
	const size = structure.getSize();
	const entities: never[] = [];
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const blocks = structure.blocks.map((b) => {
		return { pos: b.pos, state: b.state };
	});
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const palette = structure.palette.map((p) => {
		return {
			Name: `${p.name.namespace}:${p.name.path}`,
			Properties: p.properties
		};
	});
	const json = { size, blocks, palette, entities };
	const tags = jsonToNBT(json);
	return new NbtFile('', tags as NbtCompound, 'gzip', false, undefined);
}
function jsonToNBT(json: any): NbtTag {
	if (Array.isArray(json)) {
		const mappedValues = json.map((v) => jsonToNBT(v));
		return new NbtList(mappedValues);
	} else if (typeof json === 'object') {
		const mappedValues = new Map();
		Object.entries(json).forEach(([key, value]) => {
			mappedValues.set(key, jsonToNBT(value));
		});
		return new NbtCompound(mappedValues);
	} else if (Number.isInteger(json)) {
		return new NbtInt(json);
	} else if (typeof json === 'number') {
		return new NbtFloat(json);
	} else if (typeof json === 'string') {
		return new NbtString(json);
	} else if (typeof json === 'boolean') {
		return new NbtString(json ? '1' : '0');
	}
	throw `Cannot convert JSON to NBT: ${json}`;
}
