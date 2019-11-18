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
				code: '〒',
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
	}
};

export default getCurrencyInfo;
