export default function getWalletBlockchainLink(currency, address) {
	console.log(currency);
	switch (currency) {
		case 'BTC':
			return `https://www.blockchain.com/ru/btc/address/${address}`;
		case 'ETH':
			return `https://etherscan.io/address/${address}`;
		case 'LTC':
			return `https://blockchair.com/litecoin/address/${address}`;
		default:
			return 'Unknown currency';
	}
}
