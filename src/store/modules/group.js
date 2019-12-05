import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		groupWallets: JSON.parse(localStorage.getItem('stateGroupWallets')) || [],
	},
	getters: {
		GROUP_WALLETS: (state) => state.groupWallets,
	},
	mutations: {
		SET_GROUP_WALLETS: (state, payload) => {
			state.groupWallets = payload;
			localStorage.setItem('stateGroupWallets', JSON.stringify(payload));
		},
		SET_WALLETS_TO_GROUP: (state, { groupName, wallets }) => {
			state.groupWallets.find((group) => group.groupName === groupName).wallets = wallets;
			localStorage.setItem('stateGroupWallets', JSON.stringify(state.groupWallets));
		},
		UPDATE_GROUP_WALLETS: (state, { wallets }) => {
			state.groupWallets = state.groupWallets.map((group) => ({
				...group,
				wallets: group.wallets.map((groupWallet) => {
					const newWallet = wallets.find((wallet) => wallet.address === groupWallet.address);
					return {
						...groupWallet,
						balance: newWallet.balance,
						balanceUSD: newWallet.balanceUSD,
						isAvailable: newWallet.isAvailable,
					};
				}),
			}));
		},
	},
	actions: {
		CREATE_GROUP: ({ commit, state }, { GroupName, wallets }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AddWalletsGroup',
					GroupName: encodeURI(GroupName),
					...wallets,
					...getAuthParams(),
				},
			});
		},
		SET_WALLETS_TO_GROUP: ({ state, dispatch, commit }, { groupName, wallets }) => {
			if (wallets.length) {
				commit('SET_WALLETS_TO_GROUP', { groupName, wallets });
			} else {
				commit(
					'SET_GROUP_WALLETS',
					state.groupWallets.filter((group) => group.groupName !== groupName),
				);
			}

			const walletsToAdd = {};

			wallets.forEach((item, index) => {
				walletsToAdd[index] = item.address;
			});

			dispatch('CREATE_GROUP', { GroupName: groupName, wallets: walletsToAdd });
		},
	},
};
