export default function getCryptoInfo(currency, address = null) {
	switch (currency) {
		case 'BTC':
			return {
				shortName: 'ETH',
				fullName: 'Bitcoin',
				image: {
					corner: require('@/assets/images/btc.png'),
					square: require('@/assets/images/icons/btc-ico.svg'),
					arrow: require('@/assets/images/send-arrow-btc.svg'),
				},
				blockhainLink: `https://www.blockchain.com/ru/btc/address/${address}`,
				websites: [
					{
						name: 'Website',
						link: 'https://bitcoin.org',
					},
					{
						name: 'Reddit',
						link: 'https://www.reddit.com/r/Bitcoin/',
					},
				],
				description: `The cryptocurrency that started it all, Bitcoin is the first digital currency to solve the "double spending" or counterfeiting problem without the aid of a central authority, such as a bank or a government, making Bitcoin truly peer-to-peer.`,
				minAmountToTransfer: 0.0005,
			};
		case 'ETH':
			return {
				shortName: 'ETH',
				fullName: 'Ethereum',
				image: {
					corner: require('@/assets/images/eth.png'),
					square: require('@/assets/images/eth-ico.png'),
					arrow: require('@/assets/images/send-arrow-eth.svg'),
				},
				blockhainLink: `https://etherscan.io/address/${address}`,
				websites: [
					{
						name: 'Website',
						link: 'https://ethereum.org/',
					},
					{
						name: 'Reddit',
						link: 'https://www.reddit.com/r/ethereum/',
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com/ethereum',
					},
				],
				description: `Ethereum is a decentralized computing platform that runs smart contracts, which are
        contracts thah execute without human intervention. ETH popularized the idea programmable
        transactions instead of only for money transfers. The platform is used for crowdfunding
        (ICOs), the creation of new digital assets, and more.`,
				minAmountToTransfer: 0.0005,
			};
		case 'LTC':
			return {
				shortName: 'LTC',
				fullName: 'Litecoin',
				image: {
					corner: require('@/assets/images/ltc.svg'),
					square: require('@/assets/images/ltc-ico.svg'),
					arrow: require('@/assets/images/send-arrow-ltc.svg'),
				},
				blockhainLink: `https://blockchair.com/litecoin/address/${address}`,
				websites: [
					{
						name: 'Website',
						link: 'https://litecoin.com/',
					},
					{
						name: 'Reddit',
						link: 'https://www.reddit.com/r/ethereum/',
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com/LitecoinProject',
					},
				],
				description: `Litecoin is a cryptocurrency similar to Bitcoin. The goal of Litecoin is to provide fast transaction confirmations. Created by ex-Google employee Charlie Lee, Litecoin is often considered the silver to Bitcoin's gold.`,
				minAmountToTransfer: 0.004,
			};
		case 'LTN':
			return {
				shortName: 'LTN',
				fullName: 'Lightnet',
				image: {
					square: require('@/assets/images/ltn.svg'),
					corner: require('@/assets/images/ltn-ico.svg'),
					arrow: require('@/assets/images/send-arrow-ltn.svg'),
				},
				blockhainLink: `https://bex.lightnet.systems/address/${address}`,
				websites: [
					{
						name: 'Website',
						link: 'https://lightnet.systems/',
					},
				],
				description: `LTN is an architecture to enable large-scale applications. LTN provides developers with accounts, authentication, databases, asynchronous communication and scheduling of applications across the protocol.`,
				minAmountToTransfer: 0.00001,
			};
		default:
			return {
				fullName: 'Unknown currency',
				image: {
					corner: null,
					square: null,
					arrow: null,
				},
			};
	}
}
