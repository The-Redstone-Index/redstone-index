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
