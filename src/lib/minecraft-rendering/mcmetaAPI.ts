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
		}),
		fetch(`${MCMETA}summary/blocks/data.min.json`).then((r) => r.json())
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
					throw Error('Not implemenented');
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
