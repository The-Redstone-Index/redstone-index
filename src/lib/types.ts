import type { buildSizeOptions, buildSortOptions } from './config';

// Sorting
export type SortingOption = keyof typeof buildSortOptions;
export type SortConfig = {
	by: SortingOption;
	ascending: boolean;
	specId?: number;
};

// Specification requirements
export type ComparisonOpCode = 'gt' | 'eq' | 'lt';
export type SpecRequirement = {
	id: number;
	op: ComparisonOpCode;
	val?: number;
};

// Specifications values map
export type SpecValues = { [specId: string]: number };

// Build size
export type BuildSizeOption = keyof typeof buildSizeOptions;

// Build Type
export type BuildType = 'Circuit' | 'Module' | 'Contraption';
export type BuildTypeOption = { id: number; name: BuildType; desc: string };

// Edition Compatibility
export type EditionCompatibility = 'Java Edition Compatible' | 'Bedrock Edition Compatible';
export type EditionCompatibilityOption = { id: number; name: EditionCompatibility; desc: string };
