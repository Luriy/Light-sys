import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import { parsePythonDataObject } from '@/functions/helpers';

export default {
	namespaced: true,
	state: {
		cards: {},
	},
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
				const returnData = parsePythonArray(data)['1'].return;
				console.log(returnData);
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

				return store.commit('SET_CARDS', []);
			});
		},
		CREATE_CARD: (store, payload) => {
			const { Holder, Number, Psid, Cvv, Data, Currency } = payload;
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CreateCard',
					...getAuthParams(),
					Holder,
					Number,
					Psid,
					Cvv,
					Data,
					Currency,
				},
			}).then((data) => parsePythonDataObject(data));
		},
	},
};
