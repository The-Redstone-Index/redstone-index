// Sorting
export const buildSortOptions = {
	mcversion: {
		name: 'Working Minecraft Version',
		shortName: 'Minecraft',
		ascending: 'Earlier Versions First',
		descending: 'Latest Versions First',
		ascendingLabel: '<i class="fas fa-seedling mr-1"></i> Earliest Minecraft',
		descendingLabel: '<i class="fas fa-person-cane mr-1"></i> Latest Minecraft'
	},
	createddate: {
		name: 'Created Date',
		shortName: 'Created',
		ascending: 'Newest First',
		descending: 'Oldest First',
		ascendingLabel: '<i class="fas fa-seedling mr-1"></i> Newest',
		descendingLabel: '<i class="fas fa-person-cane mr-1"></i> Oldest'
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
		ascending: 'Smallest to Largest',
		descending: 'Largest to Smallest',
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
		description: 'Volume of 18 blocks or less.',
		example: '1x1x1 to 2x3x3',
		minBlockCount: 0,
		maxBlockCount: 18
	},
	small: {
		name: 'Small',
		description: 'Volume from 19 to 100 blocks.',
		example: '3x3x3 to 4x5x5',
		minBlockCount: 19,
		maxBlockCount: 100
	},
	medium: {
		name: 'Medium',
		description: 'Volume from 101 to 2,100 blocks.',
		example: '5x5x5 to 12x13x13',
		minBlockCount: 101,
		maxBlockCount: 500
	},
	large: {
		name: 'Large',
		description: 'Volume from 2,100 to 27,000 blocks.',
		example: '13x13x13 to 30x30x30',
		minBlockCount: 520,
		maxBlockCount: 27_000
	},
	huge: {
		name: 'Huge',
		description: 'Volume over 27,000 blocks.',
		example: '30x30x31 to 100x100x100',
		minBlockCount: 27_001,
		maxBlockCount: Infinity
	}
} as const;
