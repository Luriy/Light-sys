import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		allBalance: {},
		banks: [],
	},
	getters: {
		ALL_BALANCE: (state) => state.allBalance,
		BANKS: (state) => state.banks,
	},
	mutations: {
		SET_ALL_BALANCE: (state, payload) => (state.allBalance = payload),
		SET_BANKS: (state, payload) => (state.banks = payload),
	},
	actions: {
		GET_ALL_BALANCE: (store) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AllBalance',
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const returnData = parsePythonArray(data)['1'].return.AllBalance;
				return store.commit('SET_ALL_BALANCE', returnData);
			});
		},
		GET_BANKS: ({ commit }) => {
			return Axios({
				url: API_URL,
				method: 'GET',
				params: {
					Comand: 'FiatPsid',
					Group: 'bank',
				},
			}).then(({ data }) => {
				const returnData = parsePythonArray(data)['1'].return.Result;

				const decodedReturnData = Object.values(returnData).map((item) => {
					return {
						...item,
						name: decodeURI(item.name),
					};
				});

				console.log(decodedReturnData);

				return commit('SET_BANKS', decodedReturnData);
			});
		},
	},
};
