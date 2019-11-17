import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import { parsePythonDataObject } from '@/functions/helpers';

export default {
	namespaced: true,
	getters: {
		CARDS: (state) => state.cards,
	},
	mutations: {
		SET_CARDS: (state, payload) => {
			state.cards = payload;
		},
	},
	actions: {
		GET_CARDS: (store) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CardInfo',
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const { Cards: cards } = parsePythonArray(data)['1'].return;
				// const result = Object.keys(returnData).reduce((acc, walletCurrency) => {
				//   acc.push(
				//     ...Object.values(returnData[walletCurrency]).map(item => ({
				//       address: item.Walet,
				//       status: item.Status,
				//       currency: walletCurrency,
				//       balance: item.Balance,
				//       balanceUSD: item.BalanceUsd
				//     }))
				//   )
				//   return acc
				// }, []).filter(item => item.status !== 'Frozen');

				return store.commit('SET_CARDS', cards);
			});
		},
	},
};
