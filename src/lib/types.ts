import type { buildSizeOptions, buildSortOptions } from './config';

export type BuildType = 'Circuit' | 'Module' | 'Contraption';

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

// Build size
export type BuildSizeOption = keyof typeof buildSizeOptions;
