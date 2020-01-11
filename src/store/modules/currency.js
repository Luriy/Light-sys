import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { BASE_URL } from '@/settings/config';
import { AUTH_LOGOUT } from '@/store/actions/auth';

export default {
	namespaced: true,
	state: {
		walletsAndAccountsPageCurrencies:
			JSON.parse(localStorage.getItem('stateWalletsAndAccountsPageCurrencies')) || [],
		currencies: JSON.parse(localStorage.getItem('stateCurrencies')) || [],
		userCurrencies: JSON.parse(localStorage.getItem('stateUserCurrencies')) || [],
	},
	getters: {
		WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES: (state) => state.walletsAndAccountsPageCurrencies,
		CURRENCIES: (state) => state.currencies,
		USER_CURRENCIES: (state) => state.userCurrencies,
	},
	mutations: {
		SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES: (state, payload) => {
			state.walletsAndAccountsPageCurrencies = payload;
			localStorage.setItem('stateWalletsAndAccountsPageCurrencies', JSON.stringify(payload));
		},
		SET_CURRENCIES: (state, payload) => {
			state.currencies = payload;
			localStorage.setItem('stateCurrencies', JSON.stringify(payload));
		},
		SET_USER_CURRENCIES: (state, payload) => {
			state.userCurrencies = payload;
			localStorage.setItem('stateUserCurrencies', JSON.stringify(payload));
		},
	},
	actions: {
		GET_ALL_CURRENCIES: ({ commit }) => {
			return Axios({
				url: BASE_URL,
				method: 'GET',
				params: {
					Comand: 'FiatPsid',
					Group: 'bank',
				},
			}).then(({ data }) => {
				const returnData = Object.values(parsePythonArray(data)['1'].return.Valute).map(
					(item) => item[0],
				);

				commit('SET_CURRENCIES', returnData);

				return returnData;
			});
		},
		GET_USER_CURRENCIES: ({ commit, dispatch, rootState }) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'InfoUserValute',
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1].return;

				if (!Object.keys(Errors).length && Object.keys(responseData).length) {
					const userCurrenciesArray = Object.values(responseData.Result).map((item) => item[0]);
					commit('SET_USER_CURRENCIES', userCurrenciesArray);
					const groups = [
						...Object.keys(responseData.Group).map((key) => {
							return {
								groupName: key === '' ? 'Other accounts' : decodeURI(key),
								currencies: Object.values(responseData.Group[key]).map((groupCurrency) => ({
									currency: userCurrenciesArray.find(
										(userCurrency) => userCurrency === groupCurrency,
									),
								})),
							};
						}),
						// {
						// 	groupName: 'Other accounts',
						// 	wallets: userCurrenciesArray.filter((userCurrency) => userCurrency[1] === ''),
						// },
					];
					if (!rootState.group.groupCurrencies.length) {
						commit('group/SET_GROUP_CURRENCIES', groups, { root: true });
					}

					return userCurrenciesArray;
				} else if (Object.values(Errors).includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
					return { error: true };
				} else if (Object.keys(Errors).length) {
					const errKey = Object.keys(Errors)[0];
					commit(
						'alerts/setNotification',
						{
							message: Errors[errKey],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				} else {
					commit(
						'alerts/setNotification',
						{
							message: 'Unknown error',
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				}
			});
		},
		ADD_USER_CURRENCY: ({ commit, dispatch }, { ValuteName }) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'AddUserValute',
					ValuteName,
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1].return;

				if (!Object.keys(Errors).length && Object.keys(responseData).length) {
					return { success: true };
				} else if (Object.values(Errors).includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
					return { error: true };
				} else if (Object.keys(Errors).length) {
					const errKey = Object.keys(Errors)[0];
					commit(
						'alerts/setNotification',
						{
							message: Errors[errKey],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				} else {
					commit(
						'alerts/setNotification',
						{
							message: 'Unknown error',
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				}
			});
		},
		DELETE_USER_CURRENCY: ({ commit, dispatch }, { ValuteName }) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'DeleteUserValute',
					ValuteName,
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1].return;

				if (!Object.keys(Errors).length && Object.keys(responseData).length) {
					return { success: true };
				} else if (Object.values(Errors).includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
					return { error: true };
				} else if (Object.keys(Errors).length) {
					const errKey = Object.keys(Errors)[0];
					commit(
						'alerts/setNotification',
						{
							message: Errors[errKey],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				} else {
					commit(
						'alerts/setNotification',
						{
							message: 'Unknown error',
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				}
			});
		},
	},
};
