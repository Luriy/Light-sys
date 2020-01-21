export default function getCryptoInfo(currency) {
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
			};
		case 'LTN':
			return {
				shortName: 'LTN',
				fullName: 'Lightnet',
				image: {
					corner: require('@/assets/images/ltn.svg'),
					square: require('@/assets/images/ltn-ico.svg'),
					arrow: require('@/assets/images/send-arrow-ltn.svg'),
				},
				websites: [
					{
						name: 'Website',
						link: 'https://eos.io/',
					},
					{
						name: 'Reddit',
						link: 'https://www.reddit.com/r/eos/',
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com/block_one_',
					},
				],
				description: `EOS is an architecture to enable large-scale applications. EOS provides developers with accounts, authentication, databases, asynchronous communication and scheduling of applications across the protocol.`,
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
