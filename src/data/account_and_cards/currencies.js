export default [
	{
		code: '₽',
		full: 'Russian Ruble',
		banks: [
			{
				image: require('@/assets/images/tinkoff-bank.png'),
			},
			{
				image: require('@/assets/images/alfa-bank.png'),
			},
			{
				image: require('@/assets/images/sber-bank.png'),
			},
		],
		type: 0,
	},
	{
		code: '円',
		full: 'Japanese yen',
		isActive: false,
		type: 0,
	},
	{
		code: '$',
		full: 'U.S. dollar',
		isActive: false,
		type: 0,
	},
	{
		code: '€',
		full: 'European Euro',
		isActive: false,
		type: 0,
	},
];
