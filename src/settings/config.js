const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://api.lightnet.systems'
		: 'https://api.lightnet.systems';

const DAPP_URL = 'https://daap.lightnet.systems';

export { BASE_URL, DAPP_URL };

// https://api.lightnet.systems - main
// https://apidomenpyth.ru - test
