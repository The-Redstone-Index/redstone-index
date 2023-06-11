export async function load({ params }) {
	const buildId = params.id;

	const details = {
		id: buildId,
		name: 'Compact Instant 0-Tick 2 Wide Tileable Binary Adder',
		description: `It is indeed a very cool build. It can do something.`,
		type: 'Module',
		imgSrc: `https://picsum.photos/300/500?i=${Math.random()}`,
		tags: ['wireless redstone', 'iron farm', '0-tick pulse'],
		author: {
			username: 'plasmatech8',
			avatarSrc: `https://i.pravatar.cc/300?${Math.random()}`
		},
		pictures: [
			'/piston_trapdoor.nbt',
			...[...Array(20)].map(() => `https://picsum.photos/800/600?i=${Math.random()}`)
		],
		stats: [
			{ item: 'Items per minute', value: 124 },
			{ item: 'Input delay', value: '5 game ticks' },
			{ item: 'Automation', value: 'Semi-automatic' },
			{ item: 'Iterations per minute', value: 5 },
			{ item: 'Dimensions (X/Y/Z) (width/height/length)', value: '3x3x5' }
		],
		versions: ['1.16+', '1.17+', 'Breaks 1.19+']
	};

	const comments = [
		{
			message:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'John',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message:
				'Officiis praesentium veritatis rem, rerum debitis atque id dolorum aliquid! Vel perspiciatis, quos numquam quod amet mollitia aut cumque non totam. Rerum.',
			username: 'plasmatech8',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Rerum debitis atque id dolorum aliquid!',
			username: 'Superman',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		},
		{
			message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. ',
			username: 'Arnold Schwarzenegger',
			avatar: `https://i.pravatar.cc/300?${Math.random()}`,
			time: new Date()
		}
	];

	const quickStats = [
		{ name: 'Type', value: 'Module', icon: 'fa-cube' },
		{ name: 'Size', value: '3x5x3', icon: 'fa-up-right-and-down-left-from-center' },
		{ name: 'Likes', value: '123', icon: 'fa-thumbs-up' },
		{ name: 'Comments', value: '23', icon: 'fa-comment' },
		{ name: 'Files', value: '5', icon: 'fa-file-lines' }
	];

	return {
		details,
		comments,
		quickStats
	};
}
