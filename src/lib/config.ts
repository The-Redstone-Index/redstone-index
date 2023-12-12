type SortDirectionTerminology = {
	[key in 'mcversion' | 'createddate' | 'likes' | 'size' | 'specification']: {
		name: string;
		shortName: string;
		ascending: string;
		descending: string;
		ascendingLabel: string;
		descendingLabel: string;
	};
};

export const sortOptionsConfig: SortDirectionTerminology = {
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
};
