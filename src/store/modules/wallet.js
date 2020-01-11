import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { BASE_URL } from '@/settings/config';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import getCryptoInfo from '@/functions/getCryptoInfo';
import currensyList from '@/settings/currensyList';
import cryptoCurrencies from '@/settings/currensyList';

const getPercentage = (responseData) => {
	return {
		BTC: {
			'1h': responseData['percentage_BTC: '].percentage_1h,
			'1y': responseData['percentage_BTC: '].percentage_1y,
			'7d': responseData['percentage_BTC: '].percentage_7d,
			'24h': responseData['percentage_BTC: '].percentage_24h,
			'30d': responseData['percentage_BTC: '].percentage_30d,
			'200d': responseData['percentage_BTC: '].percentage_200d,
		},
		ETH: {
			'1h': responseData['percentage_ETH: '].percentage_1h,
			'1y': responseData['percentage_ETH: '].percentage_1y,
			'7d': responseData['percentage_ETH: '].percentage_7d,
			'24h': responseData['percentage_ETH: '].percentage_24h,
			'30d': responseData['percentage_ETH: '].percentage_30d,
			'200d': responseData['percentage_ETH: '].percentage_200d,
		},
		LTC: {
			'1h': responseData['percentage_LTC: '].percentage_1h,
			'1y': responseData['percentage_LTC: '].percentage_1y,
			'7d': responseData['percentage_LTC: '].percentage_7d,
			'24h': responseData['percentage_LTC: '].percentage_24h,
			'30d': responseData['percentage_LTC: '].percentage_30d,
			'200d': responseData['percentage_LTC: '].percentage_200d,
		},
	};
};
const getTypes = (responseData, nodeStatusData) => {
	return {
		bitcoin: {
			name: 'Bitcoin',
			code: 'BTC',
			codeMarkup: 'btc',
			price: responseData['BTC: '].bitcoin.usd,
			change24h: responseData['BTC: '].bitcoin.usd_24h_change,
			isAvailable: nodeStatusData.StatusNodeBTC === 0,
		},
		ethereum: {
			name: 'Ethereum',
			code: 'ETH',
			codeMarkup: 'eth',
			price: responseData['ETH: '].ethereum.usd,
			change24h: responseData['ETH: '].ethereum.usd_24h_change,
			isAvailable: nodeStatusData.StatusNodeETH === 0,
		},
		litecoin: {
			name: 'Litecoin',
			code: 'LTC',
			codeMarkup: 'ltc',
			price: responseData['LTC: '].litecoin.usd,
			change24h: responseData['LTC: '].litecoin.usd_24h_change,
			isAvailable: nodeStatusData.StatusNodeLTC === 0,
		},
	};
};

export default {
	namespaced: true,
	state: {
		pageDetail: {
			currency: '',
			balance: 0,
			balanceUSD: 0,
		},
		wallets: JSON.parse(localStorage.getItem('stateWalletsWallets')) || [],
		types: JSON.parse(localStorage.getItem('stateTypes')) || {},
		percentage: JSON.parse(localStorage.getItem('statePercentage')) || {},
		afterCreateWallet: false,
	},
	getters: {
		PAGE_DETAIL: (state) => state.pageDetail,
		WALLETS: (state) => state.wallets,
		TYPES: (state) => state.types,
		PERCENTAGE: (state) => state.percentage,
		AFTER_CREATE_WALLET: (state) => state.afterCreateWallet,
	},
	mutations: {
		SET_PAGE_DETAIL: (state, payload) => (state.pageDetail = payload),
		SET_WALLETS: (state, payload) => {
			state.wallets = payload;
			localStorage.setItem('stateWalletsWallets', JSON.stringify(payload));
		},
		SET_TYPES: (state, payload) => {
			state.types = payload;
			localStorage.setItem('stateTypes', JSON.stringify(payload));
		},
		SET_PERCENTAGE: (state, payload) => {
			state.percentage = payload;
			localStorage.setItem('statePercentage', JSON.stringify(payload));
		},
		SET_AFTER_CREATE_WALLET: (state, payload) => (state.afterCreateWallet = payload),
	},
	actions: {
		GET_PAGE_DETAIL: ({ dispatch, commit }, { currency, address }) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: `Balance${currency}`,
					Wallet: address,
				},
			}).then(({ data }) => {
				const returnData = parsePythonArray(data)['1'].return;

				dispatch('GET_TYPES').then(({ types }) => {
					const balance = returnData[`Balance${currency}`];
					const pageDetail = {
						currency: currency.toUpperCase(),
						balance,
						balanceUSD: balance * types[getCryptoInfo(currency).fullName.toLowerCase()].price,
					};
					commit('SET_PAGE_DETAIL', pageDetail);
					return pageDetail;
				});
			});
		},
		CREATE_WALLET({ commit, getters }, type) {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: `Add${type}wallet`,
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const errors = Object.values(parsePythonArray(data)['0'].Errors);
				const parsedData = parsePythonArray(data)['1'].return;

				if (errors.length) {
					commit(
						'alerts/setNotification',
						{
							message: errors[0],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				} else if (parsedData[`Add${type}wallet`] === 'Complete') {
					commit('SET_AFTER_CREATE_WALLET', true);
					commit('SET_WALLETS', [
						...getters.WALLETS,
						{
							address: parsedData[`${type}wallet`],
							balance: 0,
							balanceUSD: 0,
							currency: type,
							status: 'Active',
							isAvailable: true,
						},
					]);

					setTimeout(() => {
						commit('SET_AFTER_CREATE_WALLET', false); // из-за бага, что при создании кошелька
					}, 12000); // все остальные фризятся

					return parsedData;
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
		DELETE_WALLET: (state, payload) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: `FrozenWalet${payload.currency}`,
					Walet: payload.address,
					...getAuthParams(),
				},
			});
		},
		GET_WALLETS({ commit, dispatch }) {
			return Promise.all([
				Axios({
					url: BASE_URL,
					method: 'POST',
					params: {
						Comand: 'StatusNode',
					},
				}),
				Axios({
					url: BASE_URL,
					method: 'POST',
					params: {
						Comand: 'AllWalets',
						...getAuthParams(),
					},
				}),
			]).then(([{ data: nodeData }, { data }]) => {
				const errors = Object.values(parsePythonArray(data)['0'].Errors);
				const responseNodesStatusData = parsePythonArray(nodeData)['1'].return;
				const returnData = parsePythonArray(data)['1'].return;

				if (errors.includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
					return { error: true };
				} else if (errors.length) {
					commit(
						'alerts/setNotification',
						{
							message: errors[0],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { error: true };
				} else {
					const wallets = Object.keys(returnData)
						.reduce((acc, walletCurrency) => {
							if (Object.keys(currensyList).some((currency) => currency === walletCurrency)) {
								acc.push(
									...Object.values(returnData[walletCurrency]).map((item) => ({
										address: item.Walet,
										status: item.Status,
										currency: walletCurrency,
										balance: item.Balance,
										balanceUSD: item.BalanceUsd,
										isAvailable: responseNodesStatusData[`StatusNode${walletCurrency}`] === 0,
										group: decodeURI(item.Group),
									})),
								);
							}

							return acc;
						}, [])
						.filter(({ status }) => status !== 'Frozen');

					// DEVELOPMENT CODE FOR UNFREEZE WALLETS

					// result.forEach(item => {
					//   return Axios({
					//     url: BASE_URL,
					//     method: 'POST',
					//     params: {
					//       Comand: `UnFrozenWalet${item.currency}`,
					//       Walet: item.address,
					//       ...getAuthParams()
					//     }
					//   })
					// })

					commit('SET_WALLETS', wallets);

					commit(
						'group/SET_AND_TRANSFORM_WALLETS_TO_GROUPS',
						{ group: returnData.Group, wallets },
						{ root: true },
					);

					return { wallets };
				}
			});
		},
		UPDATE_WALLETS_AND_TYPES: async ({ commit, state, rootState }) => {
			let allUsdBalance = 0;
			const [{ data: infoCryptsData }, { data: statusNodeData }] = await Promise.all([
				Axios({
					url: BASE_URL,
					method: 'GET',
					params: {
						Comand: `InfoCrypts`,
					},
				}),
				Axios({
					url: BASE_URL,
					method: 'POST',
					params: {
						Comand: 'StatusNode',
					},
				}),
			]);
			const parsedInfoCryptsData = parsePythonArray(infoCryptsData)['1'].return;
			const parsedStatusNodeData = parsePythonArray(statusNodeData)['1'].return;

			let results = await Promise.all(
				Object.keys(cryptoCurrencies).map(async (currency) => {
					const { data: walletsData } = await Axios({
						url: BASE_URL,
						method: 'POST',
						params: {
							Comand: `AllBalance${currency}`,
							...getAuthParams(),
						},
					});
					const parsedWalletsData = parsePythonArray(walletsData)['1'].return.Result;

					const result = Object.keys(parsedWalletsData)
						.map((key) => {
							if (
								rootState.wallet.wallets.some(
									({ address }) => address.toLowerCase() === key.toLowerCase(),
								)
							) {
								const usdToCryptoCourse =
									parsedInfoCryptsData[`${currency}: `][
										getCryptoInfo(currency).fullName.toLowerCase()
									].usd;
								allUsdBalance += parsedWalletsData[key] * usdToCryptoCourse;

								return {
									address: key,
									balance: parsedWalletsData[key],
									balanceUSD: parsedWalletsData[key] * usdToCryptoCourse,
									isAvailable: Number(parsedStatusNodeData[`StatusNode${currency}`]) === 0,
								};
							} else {
								return null;
							}
						})
						.filter((item) => !!item);

					return result;
				}),
			);
			commit('user/SET_ALL_USD_BALANCE', allUsdBalance.toFixed(2), { root: true });
			results = results
				.flat()
				.filter(({ address }) =>
					state.wallets.some((wallet) => wallet.address.toLowerCase() === address.toLowerCase()),
				);

			commit(
				'group/SET_GROUP_WALLETS',
				rootState.group.groupWallets.map((group) => ({
					...group,
					wallets: group.wallets.map((wallet) => {
						const currentWallet = results.find(
							({ address }) => wallet.address.toLowerCase() === address.toLowerCase(),
						);
						return {
							...wallet,
							balance: currentWallet.balance,
							balanceUSD: currentWallet.balanceUSD,
							isAvailable: currentWallet.isAvailable,
						};
					}),
				})),
				{ root: true },
			);
			commit(
				'SET_WALLETS',
				state.wallets.map((wallet) => {
					const currentWallet = results.find(
						({ address }) => wallet.address.toLowerCase() === address.toLowerCase(),
					);
					return {
						...wallet,
						balance: currentWallet.balance,
						balanceUSD: currentWallet.balanceUSD,
						isAvailable: currentWallet.isAvailable,
					};
				}),
			);
			commit('SET_PERCENTAGE', getPercentage(parsedInfoCryptsData));
			commit('SET_TYPES', getTypes(parsedInfoCryptsData, parsedStatusNodeData));
		},
		GET_TYPES: async (store) => {
			const [{ data: nodeData }, { data }] = await Promise.all([
				Axios({
					url: BASE_URL,
					method: 'POST',
					params: {
						Comand: 'StatusNode',
					},
				}),
				Axios({
					url: BASE_URL,
					method: 'GET',
					params: {
						Comand: 'InfoCrypts',
					},
				}),
			]);

			const responseData = parsePythonArray(data)['1'].return;
			const responseNodesStatusData = parsePythonArray(nodeData)['1'].return;

			const types = getTypes(responseData, responseNodesStatusData);

			const percentage = getPercentage(responseData);

			store.commit('SET_TYPES', types);

			store.commit('SET_PERCENTAGE', percentage);

			return { types, percentage };
		},
	},
};
