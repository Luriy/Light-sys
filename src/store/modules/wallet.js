import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import getCryptoInfo from '@/functions/getCryptoInfo';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';

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
		operations: JSON.parse(localStorage.getItem('stateWalletsOperations')) || [],
		unconfirmedOperations: JSON.parse(localStorage.getItem('stateUnconfirmedOperations')) || [],
		afterCreateWallet: false,
	},
	getters: {
		PAGE_DETAIL: (state) => state.pageDetail,
		WALLETS: (state) => state.wallets,
		TYPES: (state) => state.types,
		PERCENTAGE: (state) => state.percentage,
		OPERATIONS: (state) => state.operations,
		AFTER_CREATE_WALLET: (state) => state.afterCreateWallet,
		OPERATIONS_WITH_UNCONFIRMED: (state) => [...state.operations, ...state.unconfirmedOperations],
		UNCONFIRMED_OPERATIONS: (state) => state.unconfirmedOperations,
	},
	mutations: {
		SET_PAGE_DETAIL: (state, payload) => (state.pageDetail = payload),
		SET_WALLETS: (state, payload) => {
			state.wallets = payload;
			localStorage.setItem('stateWalletsWallets', JSON.stringify(payload));
		},
		UPDATE_WALLET: ({ wallets }, { wallet, amount }) => {
			wallets.find((item) => {
				if (item.address === wallet) {
					item.balance = item.balance + amount;
				}
			});
		},
		SET_TYPES: (state, payload) => {
			state.types = payload;
			localStorage.setItem('stateTypes', JSON.stringify(payload));
		},
		SET_PERCENTAGE: (state, payload) => {
			state.percentage = payload;
			localStorage.setItem('statePercentage', JSON.stringify(payload));
		},
		SET_OPERATIONS: (state, payload) => {
			state.operations = payload;
			localStorage.setItem('stateWalletsOperations', JSON.stringify(payload));
		},
		SET_AFTER_CREATE_WALLET: (state, payload) => (state.afterCreateWallet = payload),
		SET_UNCONFIRMED_OPERATIONS: (state, payload) => (state.unconfirmedOperations = payload),
	},
	actions: {
		GET_PAGE_DETAIL: ({ dispatch, commit }, { currency, address }) => {
			return Axios({
				url: API_URL,
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
				url: API_URL,
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
				url: API_URL,
				method: 'POST',
				params: {
					Comand: `FrozenWalet${payload.currency}`,
					Walet: payload.address,
					...getAuthParams(),
				},
			});
		},
		GET_WALLETS({ commit, dispatch, rootState }) {
			return Promise.all([
				Axios({
					url: API_URL,
					method: 'POST',
					params: {
						Comand: 'StatusNode',
					},
				}),
				Axios({
					url: API_URL,
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
					const result = Object.keys(returnData)
						.reduce((acc, walletCurrency) => {
							if (
								walletCurrency === 'BTC' ||
								walletCurrency === 'ETH' ||
								walletCurrency === 'LTC'
							) {
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
					//     url: API_URL,
					//     method: 'POST',
					//     params: {
					//       Comand: `UnFrozenWalet${item.currency}`,
					//       Walet: item.address,
					//       ...getAuthParams()
					//     }
					//   })
					// })
					const groups = [
						...Object.keys(returnData.Group).map((key) => {
							return {
								groupName: decodeURI(key),
								wallets: Object.values(returnData.Group[key]).map((address) =>
									result.find((res) => res.address === address),
								),
							};
						}),
						{
							groupName: '',
							wallets: result.filter((wallet) => wallet.group === ''),
						},
					];

					commit('SET_WALLETS', result);

					if (!rootState.group.groupWallets.length) {
						commit('group/SET_GROUP_WALLETS', groups, { root: true });
					} else {
						commit('group/UPDATE_GROUP_WALLETS', { wallets: result }, { root: true });
					}

					return { wallets: result, groups };
				}
			});
		},

		GET_TRANSFER_TOKEN: ({ commit, dispatch }, user) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'TransferToken',
					...user,
				},
			}).then(({ data }) => {
				const parsedData = parsePythonArray(data);
				const errors = Object.values(parsedData['0']['Errors']);
				if (errors.includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
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
				}
			});
		},
		POST_TRANSFER_CRYPTO: (state, { amount, from, to, token, currency }) => {
			const { commit, dispatch } = state;
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: `${currency}Transfer`,
					...getAuthParams(),
					From: from,
					To: to,
					Token: token,
					Amount: amount,
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1];
				if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
					return { success: true, data: responseData.return };
				} else if (Object.values(Errors).includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
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
				}
			});
		},

		GET_TYPES: async (store) => {
			const [{ data: nodeData }, { data }] = await Promise.all([
				Axios({
					url: API_URL,
					method: 'POST',
					params: {
						Comand: 'StatusNode',
					},
				}),
				Axios({
					url: API_URL,
					method: 'GET',
					params: {
						Comand: 'InfoCrypts',
					},
				}),
			]);

			const responseData = parsePythonArray(data)['1'].return;
			const responseNodesStatusData = parsePythonArray(nodeData)['1'].return;

			const types = {
				bitcoin: {
					name: 'Bitcoin',
					code: 'BTC',
					codeMarkup: 'btc',
					price: responseData['BTC: '].bitcoin.usd,
					change24h: responseData['BTC: '].bitcoin.usd_24h_change,
					isAvailable: responseNodesStatusData.StatusNodeBTC === 0,
				},
				ethereum: {
					name: 'Ethereum',
					code: 'ETH',
					codeMarkup: 'eth',
					price: responseData['ETH: '].ethereum.usd,
					change24h: responseData['ETH: '].ethereum.usd_24h_change,
					isAvailable: responseNodesStatusData.StatusNodeETH === 0,
				},
				litecoin: {
					name: 'Litecoin',
					code: 'LTC',
					codeMarkup: 'ltc',
					price: responseData['LTC: '].litecoin.usd,
					change24h: responseData['LTC: '].litecoin.usd_24h_change,
					isAvailable: responseNodesStatusData.StatusNodeLTC === 0,
				},
			};

			const percentage = {
				BTC: {
					'1h': responseData['percentage_BTC: '].percentage_1h,
					'1y': responseData['percentage_BTC: '].percentage_1y,
					'7d': responseData['percentage_BTC: '].percentage_7d,
					'24d': responseData['percentage_BTC: '].percentage_24d,
					'30d': responseData['percentage_BTC: '].percentage_30d,
					'200d': responseData['percentage_BTC: '].percentage_200d,
				},
				ETH: {
					'1h': responseData['percentage_ETH: '].percentage_1h,
					'1y': responseData['percentage_ETH: '].percentage_1y,
					'7d': responseData['percentage_ETH: '].percentage_7d,
					'24d': responseData['percentage_ETH: '].percentage_24d,
					'30d': responseData['percentage_ETH: '].percentage_30d,
					'200d': responseData['percentage_ETH: '].percentage_200d,
				},
				LTC: {
					'1h': responseData['percentage_LTC: '].percentage_1h,
					'1y': responseData['percentage_LTC: '].percentage_1y,
					'7d': responseData['percentage_LTC: '].percentage_7d,
					'24d': responseData['percentage_LTC: '].percentage_24d,
					'30d': responseData['percentage_LTC: '].percentage_30d,
					'200d': responseData['percentage_LTC: '].percentage_200d,
				},
			};

			store.commit('SET_TYPES', types);

			store.commit('SET_PERCENTAGE', percentage);

			return { types, percentage };
		},
		GET_WALLET_OPERATIONS: (store, { currency, address }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: `AllTransactions${capitalizeFirstLetter(currency.toLowerCase())}`,
					Wallet: address,
				},
			}).then(({ data }) => {
				const parsedData = parsePythonArray(data)['1'].return;

				const dates = [];
				const transactions = Object.values(parsedData).map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					if (
						// * 1000 - because in js milliseconds, + hour
						dates.every(
							(date) =>
								date.getDate() !== itemDate.getDate() ||
								date.getMonth() !== itemDate.getMonth() ||
								date.getFullYear() !== itemDate.getFullYear(),
						)
					) {
						dates.push(itemDate);
					}
					return {
						source: item,
						currency,
						address: item.address || item.To,
						time: itemDate,
						url: item.Url,
						value: item.value,
						valueUSD: item.valueUSD,
					};
				});

				let datesWithTransactions = [];

				transactions.forEach((transaction) => {
					const date = dates.find((date) => {
						return (
							date.getDate() === transaction.time.getDate() &&
							date.getMonth() === transaction.time.getMonth() &&
							date.getFullYear() === transaction.time.getFullYear()
						);
					});

					const addedTransObject = datesWithTransactions.find(
						({ date: dateTrans }) =>
							dateTrans.getDate() === date.getDate() &&
							dateTrans.getMonth() === date.getMonth() &&
							dateTrans.getFullYear() === date.getFullYear(),
					);
					if (addedTransObject) {
						addedTransObject.transactions = [...addedTransObject.transactions, transaction];
					} else {
						datesWithTransactions = [
							...datesWithTransactions,
							{
								date,
								transactions: [
									...(datesWithTransactions.find(({ date }) => date === transaction.time) || []),
									transaction,
								],
							},
						];
					}
				});

				datesWithTransactions = datesWithTransactions.map((obj) => {
					return {
						...obj,
						transactions: obj.transactions.reverse(),
					};
				});

				return datesWithTransactions.reverse();
			});
		},
		GET_OPERATIONS: async (store, { wallets }) => {
			const dates = [];
			const transactions = (
				await Promise.all(
					wallets.map(async (wallet) => {
						let Comand;

						switch (wallet.currency) {
							case 'BTC':
								Comand = 'AllTransactionsBtc';
								break;
							case 'ETH':
								Comand = 'AllTransactionsEth';
								break;
							case 'LTC':
								Comand = 'AllTransactionsLtc';
								break;
							default:
								throw new Error('Unknown currency');
						}

						const { data } = await Axios({
							url: API_URL,
							method: 'POST',
							params: {
								Comand,
								Wallet: wallet.address,
							},
						});

						const transactions = Object.values(parsePythonArray(data)[1].return).map((item) => {
							const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
							if (
								dates.every(
									(date) =>
										date.getDate() !== itemDate.getDate() ||
										date.getMonth() !== itemDate.getMonth() ||
										date.getFullYear() !== itemDate.getFullYear(),
								)
							) {
								dates.push(itemDate);
							}

							return {
								source: item,
								currency: wallet.currency,
								address: item.address || item.To, // FIXME: Адрес не работает корректно
								time: itemDate,
								url: item.Url,
								value: item.value,
								valueUSD: item.valueUSD,
								currentWallet: wallet.address,
							};
						});

						return transactions;
					}),
				)
			).flat();

			console.log(transactions);

			const { unconfirmedOperations } = store.state;

			if (unconfirmedOperations.length) {
				console.log(
					unconfirmedOperations.filter((unconf) =>
						transactions.every(
							(trans) => trans.url !== unconf[0].url || trans.url !== unconf[1].url,
						),
					),
				);
				this.$store.commit(
					'SET_UNCONFIRMED_OPERATIONS',
					unconfirmedOperations.filter((unconf) =>
						transactions.every(
							(trans) => trans.url !== unconf[0].url || trans.url !== unconf[1].url,
						),
					),
				);
			}

			let datesWithTransactions = [];

			transactions.forEach((transaction) => {
				const date = dates.find((date) => {
					return (
						date.getDate() === transaction.time.getDate() &&
						date.getMonth() === transaction.time.getMonth() &&
						date.getFullYear() === transaction.time.getFullYear()
					);
				});

				const addedTransObject = datesWithTransactions.find(
					({ date: dateTrans }) =>
						dateTrans.getDate() === date.getDate() &&
						dateTrans.getMonth() === date.getMonth() &&
						dateTrans.getFullYear() === date.getFullYear(),
				);
				if (addedTransObject) {
					addedTransObject.transactions = [...addedTransObject.transactions, transaction];
				} else {
					datesWithTransactions = [
						...datesWithTransactions,
						{
							date,
							transactions: [
								...(datesWithTransactions.find(({ date }) => date === transaction.time) || []),
								transaction,
							],
						},
					];
				}
			});

			const filterByDateTimeFunc = (a, b) => {
				if (a.time < b.time) return -1;
				else if (a.time > b.time) return 1;
				else return 0;
			};
			const filterfilterByDateFunc = (a, b) => {
				if (a.date < b.date) return -1;
				else if (a.date > b.date) return 1;
				else return 0;
			};

			datesWithTransactions = datesWithTransactions.map((obj) => {
				return {
					...obj,
					transactions: obj.transactions
						.slice()
						.sort(filterByDateTimeFunc)
						.reverse(),
				};
			});

			datesWithTransactions.sort(filterfilterByDateFunc);

			store.commit('SET_OPERATIONS', datesWithTransactions.slice().reverse());
			return datesWithTransactions.reverse();
		},
		// SEND: (store, { currency, from, to, amount }) => {
		//   Axios({
		//     url: API_URL,
		//     method: 'POST',
		//     params: {
		//       Comand: 'TransferToken',
		//       ...getAuthParams(),
		//     }
		//   }).then(({ data }) => {
		//     console.log(data);
		//   })

		//   // let Comand;

		//   // switch (currency) {
		//   //   case 'BTC': Comand = 'BtcTransfer'; break;
		//   //   case 'ETH': Comand = 'EthTransfer'; break;
		//   //   default: throw 'Unknown currency';
		//   // }
		// },
	},
};
