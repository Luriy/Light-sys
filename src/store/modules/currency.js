export default {
	namespaced: true,
	state: {
		walletsAndAccountsPageCards:
			JSON.parse(localStorage.getItem('stateWalletsAndAccountsPageCurrencies')) || [],
	},
	getters: {
		WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES: (state) => state.walletsAndAccountsPageCards,
	},
	mutations: {
		SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES: (state, payload) => {
			state.walletsAndAccountsPageCards = payload;
			localStorage.setItem('stateWalletsAndAccountsPageCurrencies', JSON.stringify(payload));
		},
	},
	actions: {},
};
