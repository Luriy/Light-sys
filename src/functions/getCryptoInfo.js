export default function getCryptoInfo(currency) {
	switch (currency) {
		case 'BTC':
			return {
				fullName: 'Bitcoin',
				image: {
					corner: require('@/assets/images/btc.png'),
				},
			};
		case 'ETH':
			return {
				fullName: 'Ethereum',
				image: {
					corner: require('@/assets/images/eth.png'),
				},
			};
		case 'LTC':
			return {
				fullName: 'Litecoin',
				image: {
					corner: require('@/assets/images/ltc.svg'),
				},
			};
		default:
			return {
				fullName: 'Unknown currency',
				image: {
					corner: null,
				},
			};
	}
}
