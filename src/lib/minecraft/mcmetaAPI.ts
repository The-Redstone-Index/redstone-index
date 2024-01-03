/**
 * Modified from: https://github.com/misode/deepslate/blob/52c44ba60df838c640c47e9cf1f471d8532ae08f/demo/main.ts#L63
 */
import {
	BlockDefinition,
	BlockModel,
	TextureAtlas,
	upperPowerOfTwo,
	type Resources,
	type UV
} from 'deepslate';
/* eslint-disable @typescript-eslint/no-explicit-any */

export const MCMETA_ENDPOINT = 'https://raw.githubusercontent.com/misode/mcmeta';
export const SERVER_ENDPOINT = '/api/mcmeta';
type ResourcesEndpoint = typeof MCMETA_ENDPOINT | typeof SERVER_ENDPOINT;

const VERSIONS_DATA_PATH = '/summary/versions/data.min.json';
const BLOCK_DEFINITION_DATA_PATH = '/summary/assets/block_definition/data.min.json';
const MODEL_DATA_PATH = '/summary/assets/model/data.min.json';
const ATLAS_ALL_DATA_PATH = '/atlas/all/data.min.json';
const ATLAS_IMAGE_PATH = '/atlas/all/atlas.png';
const BLOCKS_DATA_PATH = '/summary/blocks/data.min.json';

export interface Version {
	id: string;
	name: string;
	release_target: null | string;
	type: 'release' | 'snapshot';
	stable: boolean;
	data_version: number;
	protocol_version: number;
	data_pack_version: number;
	resource_pack_version: number;
	build_time: string;
	release_time: string;
	sha1: string;
}

export async function getVersionList(endpoint: ResourcesEndpoint = SERVER_ENDPOINT) {
	const res = await fetch(endpoint + VERSIONS_DATA_PATH);
	return (await res.json()) as Version[];
}

export async function getBlockList(endpoint: ResourcesEndpoint = SERVER_ENDPOINT) {
	const res = await fetch(endpoint + BLOCK_DEFINITION_DATA_PATH);
	const data = (await res.json()) as { [key: string]: any };
	return Object.keys(data) as string[];
}

export async function getResources(endpoint: ResourcesEndpoint = SERVER_ENDPOINT) {
	return await Promise.all([
		fetch(endpoint + BLOCK_DEFINITION_DATA_PATH).then((r) => r.json()),
		fetch(endpoint + MODEL_DATA_PATH).then((r) => r.json()),
		fetch(endpoint + ATLAS_ALL_DATA_PATH).then((r) => r.json()),
		new Promise<HTMLImageElement>((res) => {
			const image = new Image();
			image.onload = () => res(image);
			image.crossOrigin = 'Anonymous';
			image.src = endpoint + ATLAS_IMAGE_PATH;
		}),
		fetch(endpoint + BLOCKS_DATA_PATH).then((r) => r.json())
	]).then(([blockstates, models, uvMap, atlas, blockPropertyOptions]) => {
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
					throw Error('Not implemented');
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				getDefaultBlockProperties(id) {
					const list = blockPropertyOptions[id.path];
					if (!list) return;
					return list[list.length - 1];
				}
			};
			return resources;
		} catch (e) {
			console.error(e);
			throw Error('Unable to load Minecraft resource data');
		}
	});
}
