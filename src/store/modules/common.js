import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		banks: [],
	},
	getters: {
		BANKS: (state) => state.banks,
	},
	mutations: {
		SET_BANKS: (state, payload) => (state.banks = payload),
	},
	actions: {
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

				return commit('SET_BANKS', decodedReturnData);
			});
		},
	},
};
