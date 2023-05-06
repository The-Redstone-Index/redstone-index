/**
 * Modified from: https://github.com/misode/deepslate/blob/52c44ba60df838c640c47e9cf1f471d8532ae08f/demo/main.ts#L63
 */
import {
	BlockDefinition,
	BlockModel,
	Identifier,
	ItemRenderer,
	NbtFile,
	Structure,
	StructureRenderer,
	TextureAtlas,
	upperPowerOfTwo,
	type Resources,
	type UV
} from 'deepslate';
import { mat4 } from 'gl-matrix';
import { writable } from 'svelte/store';
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

export function getStructureBlockList(schemaData: ArrayBuffer) {
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const blocks = structure.blocks;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const palette = structure.palette;
	const blockList: { [key: string]: number } = {};
	blocks.forEach((b: any) => {
		const state = b.state;
		const paleteBlock = palette[state];
		const name: string = paleteBlock.name.path;
		if (name === 'air' || !name) return;
		blockList[name] = blockList[name] ? blockList[name] + 1 : 1;
	});
	return blockList;
}

export async function createItemRenderer(
	canvas: HTMLCanvasElement,
	resources: Resources,
	blockId: string
) {
	if (blockId === 'redstone_wire') blockId = 'redstone';
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const itemGl = canvas.getContext('webgl')!;
	const itemRenderer = new ItemRenderer(itemGl, Identifier.parse(blockId), resources);
	itemRenderer.drawItem();
}

export function createStructureViewer(
	canvas: HTMLCanvasElement,
	schemaData: ArrayBuffer,
	resources: Resources,
	defaultXRotation = 0.8,
	defaultYRotation = 0.5,
	defaultViewDistance = 4,
	defaultElevation = 5,
	doStaticRotation = false,
	doInputControls = false
) {
	const clipElevationStore = writable(defaultElevation);

	/*
	 * Init data
	 */
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const blocks = structuredClone(structure.blocks);
	const size = structure.getSize();

	/*
	 * Rendering
	 */
	const structureGl = canvas.getContext('webgl') as WebGLRenderingContext;
	const structureRenderer = new StructureRenderer(structureGl, structure, resources);

	let viewDist = defaultViewDistance;
	let xRotation = defaultXRotation;
	let yRotation = defaultYRotation;
	function render() {
		// Set camera position
		yRotation = yRotation % (Math.PI * 2);
		xRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, xRotation));
		viewDist = Math.max(1, Math.min(50, viewDist));
		const view = mat4.create();
		mat4.translate(view, view, [0, 0, -viewDist]);
		mat4.rotate(view, view, xRotation, [1, 0, 0]);
		mat4.rotate(view, view, yRotation, [0, 1, 0]);
		mat4.translate(view, view, [-size[0] / 2, -size[1] / 2, -size[2] / 2]);

		// Draw
		structureRenderer.updateStructureBuffers();
		structureRenderer.drawStructure(view);
		structureRenderer.drawGrid(view);
	}
	requestAnimationFrame(render);

	/*
	 * Controls
	 */
	if (doStaticRotation) {
		setInterval(() => {
			yRotation -= 0.005;
			requestAnimationFrame(render);
		}, 10);
	}
	if (doInputControls) {
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

	return {
		clipElevation: {
			set: (v: number) => {
				clipElevationStore.set(v);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				structure.blocks = blocks.filter((b: any) => b.pos[1] < v);
				requestAnimationFrame(render);
			},
			subscribe: clipElevationStore.subscribe
		}
	};
}
