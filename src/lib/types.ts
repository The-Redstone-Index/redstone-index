export type BuildType = 'Circuit' | 'Module' | 'Contraption';

// Sorting
/*
	Direction:
	- Ascending
	- Descending

	Options:
	- Minecraft Version
	- Date created
	- Likes
	- Specification
	- Size
*/
export type SortingOption = 'mcversion' | 'createddate' | 'likes' | 'specification' | 'size';
export type SortConfig = {
	by?: SortingOption;
	ascending?: boolean;
	specId?: number;
};

// Specification requirements
export type ComparisonOpCode = 'gt' | 'eq' | 'lt';
export type SpecRequirement = {
	id: number;
	op: ComparisonOpCode;
	val?: number;
};

// Schematic size
export type SchematicSize = 'small' | 'medium' | 'large' | 'huge';
