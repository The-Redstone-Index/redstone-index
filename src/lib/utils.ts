export function versionToInt(version: string): number {
	const versionParts = version.split('.').map((part) => parseInt(part));
	let versionInt = 0;
	let multiplier = 1000000; // Adjust this based on your needs
	for (const part of versionParts) {
		versionInt += part * multiplier;
		multiplier /= 1000;
	}
	return versionInt;
}
