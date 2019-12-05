import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		groupWallets: JSON.parse(localStorage.getItem('stateGroupWallets')) || [],
		groupCards: JSON.parse(localStorage.getItem('stateGroupCards')) || [],
	},
	getters: {
		GROUP_WALLETS: (state) => state.groupWallets,
		GROUP_CARDS: (state) => state.groupCards,
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
		SET_GROUP_CARDS: (state, payload) => {
			state.groupCards = payload;
			localStorage.setItem('stateGroupCards', JSON.stringify(payload));
		},
	},
	actions: {
		CREATE_WALLET_GROUP: (store, { GroupName, wallets }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					...getAuthParams(),
					Comand: 'AddWalletsGroup',
					GroupName: encodeURI(GroupName),
					...wallets,
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
		CREATE_CARD_GROUP: (store, { GroupName, cards }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AddCardGroup',
					...getAuthParams(),
					GroupName: encodeURI(GroupName),
					...cards,
				},
			});
		},
		SET_CARDS_TO_GROUP: ({ state, dispatch, commit }, { groupName, cards }) => {
			if (cards.length) {
				commit('SET_CARDS_TO_GROUP', { groupName, cards });
			} else {
				commit(
					'SET_GROUP_CARDS',
					state.groupWallets.filter((group) => group.groupName !== groupName),
				);
			}

			const cardsToAdd = {};

			cards.forEach((item, index) => {
				cardsToAdd[index] = item.number;
			});

			dispatch('CREATE_WALLET_GROUP', { GroupName: groupName, wallets: cardsToAdd });
		},
	},
};
