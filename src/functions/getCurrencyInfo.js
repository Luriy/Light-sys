const getCurrencyInfo = (currency) => {
	switch (currency) {
		case 'RUR':
			return {
				fullName: 'Russian Ruble',
				code: '₽',
			};
		case 'KZT':
			return {
				fullName: 'Tenge',
				code: '&#8376',
			};
		case 'UAH':
			return {
				fullName: 'Hryvnia',
				code: '₴',
			};
		case 'USD':
			return {
				fullName: 'US Dollar',
				code: '$',
			};
		default:
			return {
				fullName: 'Unknown',
				code: 'Unknown',
			};
	}
};

export default getCurrencyInfo;
