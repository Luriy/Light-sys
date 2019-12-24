import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';

export default {
	namespaced: true,
	state: {
		transactions: JSON.parse(localStorage.getItem('stateWalletsTransactions')) || [],
	},
	getters: {
		ALL_TRANSACTIONS: (state) => state.transactions,
	},
	mutations: {
		SET_ALL_TRANSACTIONS: (state, payload) => {
			state.transactions = payload;
			localStorage.setItem('stateWalletsTransactions', JSON.stringify(payload));
		},
	},
	actions: {
		GET_WALLET_TRANSACTIONS: (store, { currency, address }) => {
			return Promise.all([
				Axios({
					url: API_URL,
					method: 'POST',
					params: {
						Comand: `AllTransactions${capitalizeFirstLetter(currency.toLowerCase())}`,
						Wallet: address,
					},
				}),
				Axios({
					url: API_URL,
					method: 'POST',
					params: {
						Comand: 'EthBtcEthHistory',
						...getAuthParams(),
					},
				}),
			]).then(([{ data }, { data: exchangeData }]) => {
				console.log(exchangeData);
				const parsedData = parsePythonArray(data)['1'].return;
				const allTransactions = Object.values(parsedData).map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					return {
						source: {
							To: item.address,
							From: item.address,
							...item,
						},
						currency: currency,
						address: item.address, // FIXME: Адрес не работает корректно
						time: itemDate,
						url: item.Url,
						value: item.value,
						valueUSD: item.valueUSD,
						currentWallet: {
							address: address,
							currency: currency,
						},
						fee: item.Fee || 0,
						feeUSD: item.FeeUsd || 0,
						type: (item.From
						? item.From.toLowerCase() === address.toLowerCase()
						: item.value < 0)
							? 'send'
							: 'receive',
					};
				});

				const parsedExchangeData = parsePythonArray(exchangeData)['1'].return;
				const exchangeTransactions = Object.values(parsedExchangeData).map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					return {
						source: {
							To: item.address,
							From: item.address,
							...item,
						},
						currency: currency,
						address: item.address, // FIXME: Адрес не работает корректно
						time: itemDate,
						url: item.Url,
						value: item.value,
						valueUSD: item.valueUSD,
						currentWallet: {
							address: address,
							currency: currency,
						},
						fee: item.Fee || 0,
						feeUSD: item.FeeUsd || 0,
						type: 'exchange',
					};
				});

				const transactions = [...allTransactions, ...exchangeTransactions];

				const transactionsPerPage = 20;
				let transactionsWithPagination = new Array(
					Math.ceil(transactions.length / transactionsPerPage),
				).fill([]);
				const filterByDateTimeFunc = (a, b) => {
					if (a.time < b.time) return -1;
					else if (a.time > b.time) return 1;
					else return 0;
				};
				const filterByDateFunc = (a, b) => {
					if (a.date < b.date) return -1;
					else if (a.date > b.date) return 1;
					else return 0;
				};

				transactions.sort(filterByDateTimeFunc);
				transactions.reverse();

				transactions.forEach((item, index) => {
					const currentIndex = Math.floor(index / transactionsPerPage);
					transactionsWithPagination[currentIndex] = [
						...transactionsWithPagination[currentIndex],
						item,
					];
				});

				transactionsWithPagination = transactionsWithPagination.map((transactions) => {
					let datesWithTransactions = [];
					const dates = [];
					transactions.forEach(({ time }) => {
						if (
							dates.every(
								(date) =>
									date.getDate() !== time.getDate() ||
									date.getMonth() !== time.getMonth() ||
									date.getFullYear() !== time.getFullYear(),
							)
						) {
							dates.push(time);
						}
					});

					transactions.forEach((transaction) => {
						const date = dates.find((date) => {
							return (
								date.getDate() === new Date(Date.parse(transaction.time)).getDate() &&
								date.getMonth() === new Date(Date.parse(transaction.time)).getMonth() &&
								date.getFullYear() === new Date(Date.parse(transaction.time)).getFullYear()
							);
						});

						const addedTransObject = datesWithTransactions.find(
							({ date: dateTrans }) =>
								new Date(Date.parse(dateTrans)).getDate() === date.getDate() &&
								new Date(Date.parse(dateTrans)).getMonth() === date.getMonth() &&
								new Date(Date.parse(dateTrans)).getFullYear() === date.getFullYear(),
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
							transactions: obj.transactions.slice(),
						};
					});
					datesWithTransactions.sort(filterByDateFunc);
					return datesWithTransactions.reverse();
				});

				return transactionsWithPagination;
			});
		},
		GET_ALL_TRANSACTIONS: async (store, { wallets }) => {
			const { commit } = store;

			let transactions = (
				await Promise.all(
					wallets.map(async (wallet) => {
						const { data } = await Axios({
							url: API_URL,
							method: 'POST',
							params: {
								Comand: `AllTransactions${capitalizeFirstLetter(wallet.currency.toLowerCase())}`,
								Wallet: wallet.address,
							},
						});

						const transactions = Object.values(parsePythonArray(data)[1].return).map((item) => {
							const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);

							return {
								source: {
									To: item.address,
									From: item.address,
									...item,
								},
								currency: wallet.currency,
								address: item.address, // FIXME: Адрес не работает корректно
								time: itemDate,
								url: item.Url,
								value: item.value,
								valueUSD: item.valueUSD,
								currentWallet: {
									address: wallet.address,
									currency: wallet.currency,
								},
								confirmations: item.Confirmations,
								fee: item.Fee || 0,
								feeUSD: item.FeeUsd || 0,
								type: (item.From
								? item.From.toLowerCase() === wallet.address.toLowerCase()
								: item.value < 0)
									? 'send'
									: 'receive',
							};
						});

						return transactions;
					}),
				)
			).flat();

			const transactionsPerPage = 20;
			let transactionsWithPagination = new Array(
				Math.ceil(transactions.length / transactionsPerPage),
			).fill([]);
			const filterByDateTimeFunc = (a, b) => {
				if (a.time < b.time) return -1;
				else if (a.time > b.time) return 1;
				else return 0;
			};
			const filterByDateFunc = (a, b) => {
				if (a.date < b.date) return -1;
				else if (a.date > b.date) return 1;
				else return 0;
			};

			transactions.sort(filterByDateTimeFunc);
			transactions.reverse();

			transactions.forEach((item, index) => {
				const currentIndex = Math.floor(index / transactionsPerPage);
				transactionsWithPagination[currentIndex] = [
					...transactionsWithPagination[currentIndex],
					item,
				];
			});

			transactionsWithPagination = transactionsWithPagination.map((transactions) => {
				let datesWithTransactions = [];
				const dates = [];
				transactions.forEach(({ time }) => {
					if (
						dates.every(
							(date) =>
								date.getDate() !== time.getDate() ||
								date.getMonth() !== time.getMonth() ||
								date.getFullYear() !== time.getFullYear(),
						)
					) {
						dates.push(time);
					}
				});

				transactions.forEach((transaction) => {
					const date = dates.find((date) => {
						return (
							date.getDate() === new Date(Date.parse(transaction.time)).getDate() &&
							date.getMonth() === new Date(Date.parse(transaction.time)).getMonth() &&
							date.getFullYear() === new Date(Date.parse(transaction.time)).getFullYear()
						);
					});

					const addedTransObject = datesWithTransactions.find(
						({ date: dateTrans }) =>
							new Date(Date.parse(dateTrans)).getDate() === date.getDate() &&
							new Date(Date.parse(dateTrans)).getMonth() === date.getMonth() &&
							new Date(Date.parse(dateTrans)).getFullYear() === date.getFullYear(),
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
						transactions: obj.transactions.slice(),
					};
				});
				datesWithTransactions.sort(filterByDateFunc);
				return datesWithTransactions.reverse();
			});

			commit('SET_ALL_TRANSACTIONS', transactionsWithPagination);
			return transactionsWithPagination;
		},
	},
};
