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
import { mat4, vec3 } from 'gl-matrix';
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

export async function renderStaticItem(
	canvas: HTMLCanvasElement,
	resources: Resources,
	blockId: string
) {
	if (blockId === 'redstone_wire') blockId = 'redstone';

	// Render on an offscreen canvas
	const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
	const gl = offscreenCanvas.getContext('webgl');
	if (!gl) return;
	const itemRenderer = new ItemRenderer(gl, Identifier.parse(blockId), resources);
	itemRenderer.drawItem();

	// Draw onto on-screen canvas
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.drawImage(offscreenCanvas, 0, 0);

	// Cleanup
	// (too many webgl contexts will cause browser error)
	gl.getExtension('WEBGL_lose_context')?.loseContext();
}

export async function renderStaticStructure(
	canvas: HTMLCanvasElement,
	schemaData: ArrayBuffer,
	resources: Resources,
	xRotation = 0.7,
	yRotation = 2.1,
	viewDistance = 6
) {
	// Render on the existing canvas
	// (offscreen canvas does not work for structures for some reason)
	// (must replace the old canvas with new canvas with copied data)
	const gl = canvas.getContext('webgl');
	if (!gl) return;

	// Set camera position
	const view = mat4.create();
	const schemaFile = NbtFile.read(new Uint8Array(schemaData));
	const structure = Structure.fromNbt(schemaFile.root);
	const size = structure.getSize();
	const origin = vec3.fromValues(-size[0] / 2, -size[1] / 2, -size[2] / 2);
	mat4.translate(view, view, [0, 0, -viewDistance]);
	mat4.rotate(view, view, xRotation, [1, 0, 0]);
	mat4.rotate(view, view, yRotation, [0, 1, 0]);
	mat4.translate(view, view, origin);

	// Draw
	const structureRenderer = new StructureRenderer(gl, structure, resources);
	structureRenderer.updateStructureBuffers();
	structureRenderer.drawStructure(view);
	structureRenderer.drawGrid(view);

	// Draw onto a new canvas, and replace the existing one
	const newCanvas = document.createElement('canvas');
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;
	const newCanvasCtx = newCanvas.getContext('2d');
	if (!newCanvasCtx) return;
	newCanvasCtx.drawImage(canvas, 0, 0);
	canvas.replaceWith(newCanvas);

	// Cleanup
	// (too many webgl contexts will cause browser error)
	gl.getExtension('WEBGL_lose_context')?.loseContext();
}

function calculateCamVectors(xRot: number, yRot: number) {
	// (don't know why rotation needs to be manipulated in this calculation
	const camDirection = vec3.fromValues(
		Math.cos(yRot - Math.PI / 2) * Math.cos(-xRot),
		Math.sin(-xRot),
		Math.sin(yRot - Math.PI / 2) * Math.cos(-xRot)
	);
	const worldUp = vec3.fromValues(0, 1, 0);
	const camRight = vec3.cross(vec3.create(), camDirection, worldUp);
	const camUp = vec3.cross(vec3.create(), camDirection, camRight);
	const camRightNormalized = vec3.normalize(vec3.create(), camRight);
	const camUpNormalized = vec3.normalize(vec3.create(), camUp);
	return {
		camDir: camDirection,
		camUp: camUpNormalized,
		camRight: camRightNormalized
	};
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
	const origin = vec3.fromValues(-size[0] / 2, -size[1] / 2, -size[2] / 2);
	function render() {
		// Set camera position
		yRotation = yRotation % (Math.PI * 2);
		xRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, xRotation));
		viewDist = Math.max(1, Math.min(50, viewDist));
		origin[0] = Math.max(Math.min(origin[0], 0), -size[0]);
		origin[1] = Math.max(Math.min(origin[1], 0), -size[1]);
		origin[2] = Math.max(Math.min(origin[2], 0), -size[2]);
		const view = mat4.create();
		mat4.translate(view, view, [0, 0, -viewDist]);
		mat4.rotate(view, view, xRotation, [1, 0, 0]);
		mat4.rotate(view, view, yRotation, [0, 1, 0]);
		mat4.translate(view, view, origin);

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
		const staticRotationInterval = setInterval(() => {
			yRotation -= 0.005;
			requestAnimationFrame(render);
			if (!canvas.isConnected) clearInterval(staticRotationInterval);
		}, 10);
	}
	if (doInputControls) {
		let dragPos: null | [number, number] = null;
		let dragging = false;
		let mouseState: null | number = null;
		const keyState: Set<string> = new Set();
		document.addEventListener('contextmenu', (evt) => {
			evt.preventDefault();
		});
		canvas.addEventListener('mousedown', (evt) => {
			evt.preventDefault();
			canvas.focus();
			mouseState = evt.button;
			dragPos = [evt.clientX, evt.clientY];
			dragging = false;
		});
		canvas.addEventListener('mousemove', (evt) => {
			if (!dragPos) return;
			dragging = true;
			// left click
			if (mouseState == 0) {
				yRotation += (evt.clientX - dragPos[0]) / 100;
				xRotation += (evt.clientY - dragPos[1]) / 100;
				dragPos = [evt.clientX, evt.clientY];
				requestAnimationFrame(render);
				return;
			}
			// middle click
			if (mouseState == 1) {
				const { camDir } = calculateCamVectors(xRotation, yRotation);
				vec3.scaleAndAdd(origin, origin, camDir, (viewDist * (evt.clientY - dragPos[1])) / 500);
				dragPos = [evt.clientX, evt.clientY];
				requestAnimationFrame(render);
			}
			// right click
			if (mouseState == 2) {
				const { camRight, camUp } = calculateCamVectors(xRotation, yRotation);
				vec3.scaleAndAdd(origin, origin, camRight, (viewDist * (evt.clientX - dragPos[0])) / 500);
				vec3.scaleAndAdd(origin, origin, camUp, (viewDist * (evt.clientY - dragPos[1])) / 500);
				dragPos = [evt.clientX, evt.clientY];
				requestAnimationFrame(render);
			}
		});
		canvas.addEventListener('mouseup', () => {
			if (!dragging) {
				// Was a click with no drag
				// Need to figure out how to select a block and display data.
			}
			// Drag ended
			dragPos = null;
			dragging = false;
		});
		canvas.addEventListener('wheel', (evt) => {
			evt.preventDefault();
			viewDist += evt.deltaY / 100;
			requestAnimationFrame(render);
		});
		canvas.addEventListener('mouseenter', () => {
			canvas.focus();
		});
		canvas.addEventListener('keydown', (evt) => {
			evt.preventDefault();
			const key = evt.key.toLowerCase();
			keyState.add(key);
		});
		document.addEventListener('keyup', (event) => {
			const key = event.key.toLowerCase();
			keyState.delete(key);
		});
		const keyControlsInterval = setInterval(() => {
			const { camDir, camRight } = calculateCamVectors(xRotation, yRotation);
			keyState.forEach((key) => {
				// Handle different keys
				switch (key) {
					case 'arrowup':
					case 'w':
						// Forwards
						vec3.scaleAndAdd(origin, origin, camDir, -viewDist / 100);
						break;
					case 'arrowdown':
					case 's':
						// Backwards
						vec3.scaleAndAdd(origin, origin, camDir, viewDist / 100);
						break;
					case 'arrowleft':
					case 'a':
						// Left
						vec3.scaleAndAdd(origin, origin, camRight, viewDist / 100);
						break;
					case 'arrowright':
					case 'd':
						// Right
						vec3.scaleAndAdd(origin, origin, camRight, -viewDist / 100);
						break;
					case ' ':
						// Up
						vec3.scaleAndAdd(origin, origin, [0, 1, 0], -viewDist / 100);
						break;
					case 'shift':
						// Down
						vec3.scaleAndAdd(origin, origin, [0, 1, 0], viewDist / 100);
						break;
					default:
						// Ignore other keys
						return;
				}
			});
			requestAnimationFrame(render);
			if (!canvas.isConnected) clearInterval(keyControlsInterval);
		}, 10);
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
