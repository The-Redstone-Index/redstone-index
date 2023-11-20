export type BuildType = 'Circuit' | 'Module' | 'Contraption';
export type SortingOption = 'Newest' | 'Popular last 7 days' | 'Popular last year' | 'Most popular';

export type ComparisonOpCode = 'gt' | 'eq' | 'lt';
export type SearchSpecReq = {
	id: number;
	op: ComparisonOpCode;
	val: number;
};
export type SchematicSize = 'small' | 'medium' | 'large' | 'huge';
