export function versionStringToInt(version: string) {
	const versionParts = version.split('.').map((part) => parseInt(part));
	const x = versionParts[0] * 1_000_000;
	const y = versionParts[1] * 1_000;
	const z = versionParts[2];
	return x + y + z;
}

export function versionIntToString(version: number) {
	const x = Math.floor((version % 1_000_000_000) / 1_000_000);
	const y = Math.floor((version % 1_000_000) / 1_000);
	const z = Math.floor(version % 1_000);
	return `${x}.${y}.${z}`;
}
