import type { BuildTypeOption } from './types';

// Storage bucket configs for file inputs
export const avatarsBucket = {
	maxSize: 3000000,
	acceptTypes: 'image/jpeg, image/png, image/gif, image/webp'
} as const;
export const imagesBucket = {
	maxSize: 3000000,
	acceptTypes: 'image/jpeg, image/png, image/gif, image/webp'
} as const;
export const schematicsBucket = {
	maxSize: 1000000,
	acceptTypes: '.nbt'
} as const;

// Sorting
export const buildSortOptions = {
	mcversion: {
		name: 'Compatible Minecraft Version',
		shortName: 'Minecraft',
		ascending: 'Oldest Versions First',
		descending: 'Newest Versions First',
		ascendingLabel: '<i class="fas fa-person-cane mr-1"></i> Oldest Minecraft',
		descendingLabel: '<i class="fas fa-seedling mr-1"></i> Newest Minecraft'
	},
	createddate: {
		name: 'Created Date',
		shortName: 'Created',
		ascending: 'Oldest First',
		descending: 'Newest First',
		ascendingLabel: '<i class="fas fa-person-cane mr-1"></i> Oldest',
		descendingLabel: '<i class="fas fa-seedling mr-1"></i> Newest'
	},
	likes: {
		name: 'Likes',
		shortName: 'Likes',
		ascending: 'Fewest First',
		descending: 'Most First',
		ascendingLabel: '<i class="fas fa-arrow-down mr-1"></i> Fewest Likes',
		descendingLabel: '<i class="fas fa-arrow-up mr-1"></i> Most Likes'
	},
	size: {
		name: 'Size',
		shortName: 'Size',
		ascending: 'Smallest First',
		descending: 'Largest First',
		ascendingLabel: '<i class="fas fa-arrow-down mr-1"></i> Smallest Size',
		descendingLabel: '<i class="fas fa-arrow-up mr-1"></i> Largest Size'
	},
	specification: {
		name: 'Specification',
		shortName: 'Spec',
		ascending: 'Lowest First',
		descending: 'Highest First',
		ascendingLabel: '<i class="fas fa-arrow-down mr-1"></i> Lowest Spec.',
		descendingLabel: '<i class="fas fa-arrow-up  mr-1"></i> Highest Spec.'
	}
} as const;

// Size
export const buildSizeOptions = {
	xsmall: {
		name: 'Extra Small',
		description: 'Volume of 27 blocks or less.',
		example: 'Smaller than 3x3x3',
		minBlockCount: null,
		maxBlockCount: 27
	},
	small: {
		name: 'Small',
		description: 'Volume from 28 to 100 blocks.',
		example: '3x3x4 to 4x5x5',
		minBlockCount: 28,
		maxBlockCount: 100
	},
	medium: {
		name: 'Medium',
		description: 'Volume from 101 to 2,100 blocks.',
		example: '5x5x5 to 12x13x13',
		minBlockCount: 101,
		maxBlockCount: 2_100
	},
	large: {
		name: 'Large',
		description: 'Volume from 2,100 to 27,000 blocks.',
		example: '13x13x13 to 30x30x30',
		minBlockCount: 2_100,
		maxBlockCount: 27_000
	},
	huge: {
		name: 'Huge',
		description: 'Volume over 27,000 blocks.',
		example: 'Larger than 30x30x31',
		minBlockCount: 27_001,
		maxBlockCount: null
	}
} as const;

// Build Types
export const buildTypes: BuildTypeOption[] = [
	{
		id: 1,
		name: 'Circuit',
		desc: 'A foundational element employed to manipulate a redstone signal, process inputs, or execute fundamental actions. Examples include monostable circuits, memory cells, and T flip-flops.'
	},
	{
		id: 2,
		name: 'Module',
		desc: 'A self-contained unit designed to activate and contribute a specific function within a larger construction. Examples include clocks, piston extenders, and item sorting modules.'
	},
	{
		id: 3,
		name: 'Contraption',
		desc: 'A comprehensive, user-facing redstone creation, encompassing a range of functionalities for practical use. Examples include automated farms, intricate doors, and advanced storage systems.'
	}
];

// Structure size guard
export const structureSizeGuard = 8000;
