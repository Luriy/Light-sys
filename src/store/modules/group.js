import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		groupWallets: JSON.parse(localStorage.getItem('stateGroupWallets')) || [],
		groupCurrencies: JSON.parse(localStorage.getItem('stateGroupCurrencies')) || [],
	},
	getters: {
		GROUP_WALLETS: (state) => state.groupWallets,
		GROUP_CURRENCIES: (state) => state.groupCurrencies,
	},
	mutations: {
		SET_AND_TRANSFORM_WALLETS_TO_GROUPS: (state, { group, wallets }) => {
			const groups = [
				...Object.keys(group).map((key) => {
					return {
						groupName: decodeURI(key),
						wallets: Object.values(group[key])
							.map((address) =>
								wallets.find((res) => res.address.toLowerCase() === address.toLowerCase()),
							)
							.filter((item) => !!item),
					};
				}),
			].filter(({ wallets }) => wallets.length !== 0);

			if (!groups.some((group) => group.groupName === 'Other wallets')) {
				groups.push({
					groupName: 'Other wallets',
					wallets: wallets.filter((wallet) => wallet.group === ''),
				});
			} else {
				const otherWalletsGroup = groups.find(({ groupName }) => groupName === 'Other wallets');
				wallets.map((item) => {
					const isGroupsContainsCurrentWallet = groups.some(({ wallets }) =>
						wallets.some(({ address }) => address === item.address),
					);
					if (!isGroupsContainsCurrentWallet) {
						otherWalletsGroup.wallets.push(item);
					}
				});
			}

			state.groupWallets = groups;
			localStorage.setItem('stateGroupWallets', JSON.stringify(groups));
		},
		SET_GROUP_WALLETS: (state, payload) => {
			state.groupWallets = payload;
			localStorage.setItem('stateGroupWallets', JSON.stringify(payload));
		},
		SET_WALLETS_TO_GROUP: (state, { groupName, wallets }) => {
			state.groupWallets.find((group) => group.groupName === groupName).wallets = wallets;
			localStorage.setItem('stateGroupWallets', JSON.stringify(state.groupWallets));
		},
		RENAME_WALLET_GROUP: (state, { oldGroupName, newGroupName }) => {
			state.groupWallets.find(
				({ groupName }) => groupName === oldGroupName,
			).groupName = newGroupName;
			localStorage.setItem('stateGroupWallets', JSON.stringify(state.groupWallets));
		},
		UPDATE_GROUP_WALLETS: (state, { wallets }) => {
			state.groupWallets = state.groupWallets.map((group) => ({
				...group,
				wallets: group.wallets.map((groupWallet) => {
					const newWallet = wallets.find(
						(wallet) => wallet.address.toLowerCase() === groupWallet.address.toLowerCase(),
					);
					return {
						...groupWallet,
						address: newWallet.address,
						balance: newWallet.balance,
						balanceUSD: newWallet.balanceUSD,
						isAvailable: newWallet.isAvailable,
					};
				}),
			}));
			localStorage.setItem('stateGroupWallets', JSON.stringify(state.groupWallets));
		},
		SET_GROUP_CURRENCIES: (state, payload) => {
			state.groupCurrencies = payload;
			localStorage.setItem('stateGroupCurrencies', JSON.stringify(payload));
		},
		SET_CURRENCIES_TO_GROUP: (state, { groupName, currencies }) => {
			state.groupCurrencies.find((group) => group.groupName === groupName).currencies = currencies;
			localStorage.setItem('stateGroupCurrencies', JSON.stringify(state.groupCurrencies));
		},
		RENAME_CURRENCY_GROUP: (state, { oldGroupName, newGroupName }) => {
			state.groupCurrencies.find(
				({ groupName }) => groupName === oldGroupName,
			).groupName = newGroupName;
			localStorage.setItem('stateGroupCurrencies', JSON.stringify(state.groupCurrencies));
		},
	},
	actions: {
		CREATE_WALLET_GROUP: (store, { GroupName, wallets }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AddWalletsGroup',
					...getAuthParams(),
					GroupName: encodeURI(GroupName),
					...wallets,
				},
			});
		},
		SET_WALLETS_TO_GROUP: ({ state, dispatch, commit }, { groupName, wallets }) => {
			if (wallets.length) {
				commit('SET_WALLETS_TO_GROUP', { groupName, wallets });
			} else {
				if (groupName === 'Other wallets') {
					commit(
						'SET_GROUP_WALLETS',
						state.groupWallets.map((group) =>
							group.groupName === 'Other wallets'
								? {
										...group,
										wallets: [],
								  }
								: group,
						),
					);
				} else {
					commit(
						'SET_GROUP_WALLETS',
						state.groupWallets.filter((group) => group.groupName !== groupName),
					);
				}
			}

			const walletsToAdd = {};

			wallets.forEach((item, index) => {
				walletsToAdd[index] = item.address;
			});

			dispatch('CREATE_WALLET_GROUP', { GroupName: groupName, wallets: walletsToAdd });
		},
		RENAME_WALLET_GROUP: ({ commit, dispatch, state }, { oldGroupName, newGroupName }) => {
			dispatch('CREATE_WALLET_GROUP', {
				GroupName: newGroupName,
				wallets: state.groupWallets
					.find(({ groupName }) => groupName === oldGroupName)
					.wallets.map(({ address }) => address),
			});
			commit('RENAME_WALLET_GROUP', { oldGroupName, newGroupName });
		},
		CREATE_CURRENCY_GROUP: (store, { GroupName, currencies }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AddValuteGroup',
					...getAuthParams(),
					GroupName: encodeURI(GroupName),
					...currencies,
				},
			});
		},
		SET_CURRENCIES_TO_GROUP: ({ state, dispatch, commit }, { groupName, currencies }) => {
			if (currencies.length) {
				commit('SET_CURRENCIES_TO_GROUP', { groupName, currencies });
			} else {
				if (groupName === 'Other accounts') {
					commit(
						'SET_GROUP_CURRENCIES',
						state.groupCurrencies.map((group) =>
							group.groupName === 'Other accounts'
								? {
										...group,
										currencies: [],
								  }
								: group,
						),
					);
				} else {
					commit(
						'SET_GROUP_CURRENCIES',
						state.groupCurrencies.filter((group) => group.groupName !== groupName),
					);
				}
			}

			const currenciesToAdd = {};

			currencies.forEach((item, index) => {
				currenciesToAdd[index] = item.currency;
			});

			dispatch('CREATE_CURRENCY_GROUP', { GroupName: groupName, currencies: currenciesToAdd });
		},
		RENAME_CURRENCY_GROUP: ({ commit, dispatch, state }, { oldGroupName, newGroupName }) => {
			dispatch('CREATE_CURRENCY_GROUP', {
				GroupName: newGroupName,
				currencies: state.groupCurrencies
					.find(({ groupName }) => groupName === oldGroupName)
					.currencies.map(({ currency }) => currency),
			});
			commit('RENAME_CURRENCY_GROUP', { oldGroupName, newGroupName });
		},
	},
};
