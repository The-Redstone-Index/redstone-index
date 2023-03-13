import {
	BlockDefinition,
	BlockModel,
	NbtFile,
	Structure,
	StructureRenderer,
	TextureAtlas,
	upperPowerOfTwo,
	type Resources,
	type UV
} from 'deepslate';
import { mat4 } from 'gl-matrix';
/* eslint-disable @typescript-eslint/no-explicit-any */

const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/';

export async function getResources() {
	return await Promise.all([
		// fetch(`${MCMETA}registries/item/data.min.json`).then((r) => r.json()),
		fetch(`${MCMETA}summary/assets/block_definition/data.min.json`).then((r) => r.json()),
		fetch(`${MCMETA}summary/assets/model/data.min.json`).then((r) => r.json()),
		fetch(`${MCMETA}atlas/all/data.min.json`).then((r) => r.json()),
		new Promise<HTMLImageElement>((res) => {
			const image = new Image();
			image.onload = () => res(image);
			image.crossOrigin = 'Anonymous';
			image.src = `${MCMETA}atlas/all/atlas.png`;
		})
	]).then(([blockstates, models, uvMap, atlas]) => {
		try {
			const blockDefinitions: Record<string, BlockDefinition> = {};
			Object.keys(blockstates).forEach((id) => {
				blockDefinitions['minecraft:' + id] = BlockDefinition.fromJson(id, blockstates[id]);
			});

			const blockModels: Record<string, BlockModel> = {};
			Object.keys(models).forEach((id) => {
				blockModels['minecraft:' + id] = BlockModel.fromJson(id, models[id]);
			});
			Object.values(blockModels).forEach((m: any) =>
				m.flatten({ getBlockModel: (id: any) => blockModels[id] })
			);

			const atlasCanvas = document.createElement('canvas');
			const atlasSize = upperPowerOfTwo(Math.max(atlas.width, atlas.height));
			atlasCanvas.width = atlasSize;
			atlasCanvas.height = atlasSize;
			const atlasCtx = atlasCanvas.getContext('2d');
			if (!atlasCtx) throw Error('atlasCtx is not defined');
			atlasCtx.drawImage(atlas, 0, 0);
			const atlasData = atlasCtx.getImageData(0, 0, atlasSize, atlasSize);
			const part = 16 / atlasData.width;
			const idMap: Record<string, UV> = {};
			Object.keys(uvMap).forEach((id: string) => {
				const u = uvMap[id][0] / atlasSize;
				const v = uvMap[id][1] / atlasSize;
				idMap['minecraft:' + id] = [u, v, u + part, v + part];
			});
			const textureAtlas = new TextureAtlas(atlasData, idMap);

			const resources: Resources = {
				getBlockDefinition(id) {
					return blockDefinitions[id.toString()];
				},
				getBlockModel(id) {
					return blockModels[id.toString()];
				},
				getTextureUV(id) {
					return textureAtlas.getTextureUV(id);
				},
				getTextureAtlas() {
					return textureAtlas.getTextureAtlas();
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				getBlockFlags(id) {
					return { opaque: false };
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				getBlockProperties(id) {
					return null;
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				getDefaultBlockProperties(id) {
					return null;
				}
			};
			return resources;
		} catch (e) {
			console.error(e);
			throw Error('Unable to load Minecraft resource data');
		}
	});
}

export function getStructureSize(schemaData: ArrayBuffer) {
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	const size = structure.getSize();
	return { x: size[0], y: size[1], z: size[2] };
}

export function renderStructure(
	canvas: HTMLCanvasElement,
	schemaData: ArrayBuffer,
	resources: Resources,
	clipElevation = 9999
) {
	/*
	 * Init data
	 */
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	const size = structure.getSize();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	structure.blocks.forEach((b: any) => {
		if (b.pos[1] >= clipElevation) {
			b.state = 3;
			console.log(b);
		}
	});

	/*
	 * Rendering
	 */
	const structureGl = canvas.getContext('webgl') as WebGLRenderingContext;
	const structureRenderer = new StructureRenderer(structureGl, structure, resources);
	let viewDist = 4;
	let xRotation = 0.8;
	let yRotation = 0.5;
	function render() {
		yRotation = yRotation % (Math.PI * 2);
		xRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, xRotation));
		viewDist = Math.max(1, Math.min(20, viewDist));

		const view = mat4.create();
		mat4.translate(view, view, [0, 0, -viewDist]);
		mat4.rotate(view, view, xRotation, [1, 0, 0]);
		mat4.rotate(view, view, yRotation, [0, 1, 0]);
		mat4.translate(view, view, [-size[0] / 2, -size[1] / 2, -size[2] / 2]);
		// itemRenderer.drawItem();
		structureRenderer.drawStructure(view);
		// structureRenderer.drawOutline(view, structure.getSize());
		structureRenderer.drawGrid(view);
	}
	requestAnimationFrame(render);

	/*
	 * Controls
	 */
	let dragPos: null | [number, number] = null;
	canvas.addEventListener('mousedown', (evt) => {
		if (evt.button === 0) {
			dragPos = [evt.clientX, evt.clientY];
		}
	});
	canvas.addEventListener('mousemove', (evt) => {
		if (dragPos) {
			yRotation += (evt.clientX - dragPos[0]) / 100;
			xRotation += (evt.clientY - dragPos[1]) / 100;
			dragPos = [evt.clientX, evt.clientY];
			requestAnimationFrame(render);
		}
	});
	canvas.addEventListener('mouseup', () => {
		dragPos = null;
	});
	canvas.addEventListener('wheel', (evt) => {
		evt.preventDefault();
		viewDist += evt.deltaY / 100;
		requestAnimationFrame(render);
	});
}
