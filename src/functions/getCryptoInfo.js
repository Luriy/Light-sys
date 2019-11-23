export default function getCryptoInfo(currency) {
	switch (currency) {
		case 'BTC':
			return {
				fullName: 'Bitcoin',
			};
		case 'ETH':
			return {
				fullName: 'Ethereum',
			};
		case 'LTC':
			return {
				fullName: 'Litecoin',
			};
		default:
			return {
				fullName: 'Unknown currency',
			};
	}
}
