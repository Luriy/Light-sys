import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
import filterTransactionsByPaginationAndDate from '@/functions/filterTransactionsByPaginationAndDate';

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
				const parsedData = parsePythonArray(data)['1'].return;
				let allTransactions = Object.values(parsedData).map((item) => {
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
						confirmations: item.Confirmations || 0,
						fee: item.Fee || 0,
						feeUSD: item.FeeUsd || 0,
						type: (item.From
						? item.From.toLowerCase() === address.toLowerCase()
						: item.value < 0)
							? 'send'
							: 'receive',
					};
				});

				const parsedExchangeData = parsePythonArray(exchangeData)['1'].return.Result;
				const exchangeTransactions = Object.values(parsedExchangeData)
					.map((item) => {
						const isCurrentWalletTransaction =
							(item.withdraw && item.withdraw.toLowerCase()) === address.toLowerCase() ||
							(item.deposit && item.deposit.toLowerCase()) === address.toLowerCase() ||
							(item.To && item.To.toLowerCase() === address.toLowerCase()) ||
							(item.From && item.From.toLowerCase() === address.toLowerCase());
						if (isCurrentWalletTransaction) {
							const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
							return [
								{
									source: {
										From: null,
										To: item.withdraw,
										...item,
									},
									currency: item.incomingType, // send exchange
									currentWallet: {
										address: item.withdraw,
										currency: item.incomingType,
									},
									time: itemDate,
									url: item.transactionURL,
									value: item.incomingCoin,
									valueUSD: 0.0001,
									fee: item.Fee || 0,
									feeUSD: item.FeeUsd || 0,
									type: 'exchange-send',
								},
								{
									source: {
										To: null,
										From: item.deposit,
										...item,
									},
									currency: item.outgoingType, // receive exchange
									currentWallet: {
										address: item.deposit,
										currency: item.outgoingType,
									},
									time: itemDate,
									url: item.transactionURL,
									value: item.outgoingCoin,
									valueUSD: 0.0001,
									fee: item.Fee || 0,
									feeUSD: item.FeeUsd || 0,
									type: 'exchange-receive',
								},
							];
						} else {
							return null;
						}
					})
					.flat()
					.filter(
						(item) =>
							!!item &&
							!!item.url &&
							item.currentWallet.currency === currency &&
							item.source.status !== 'failed',
					);

				// allTransactions = allTransactions.filter(
				// 	(item) =>
				// 		!exchangeTransactions.some(
				// 			({ url, source }) =>
				// 				url === item.url ||
				// 				(typeof source.withdraw === 'string' && source.withdraw.toLowerCase()) ===
				// 					(item.source.From ? item.source.From.toLowerCase() : 'stringforexcludeequality'),
				// 		),
				// );

				allTransactions = allTransactions.filter(
					(item) => !exchangeTransactions.some(({ url }) => url === item.url),
				);

				const transactions = [...allTransactions, ...exchangeTransactions];

				return filterTransactionsByPaginationAndDate({ transactions, transactionsPerPage: 20 });
			});
		},
		GET_CRYPTO_TRANSFER_TRANSACTIONS: async (store, { wallets }) => {
			const transactions =
				(
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
									confirmations: item.Confirmations || 0,
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
				).flat() || [];

			return filterTransactionsByPaginationAndDate({
				transactions: transactions,
				transactionsPerPage: 20,
			});
		},
		GET_CRYPTO_EXCHANGE_TRANSACTIONS: async () => {
			const { data } = await Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'EthBtcEthHistory',
					...getAuthParams(),
				},
			});
			const parsedData = parsePythonArray(data)['1'].return.Result || [];
			const transactions = Object.values(parsedData)
				.map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					return [
						{
							source: {
								To: item.withdraw,
								From: null,
								...item,
							},
							currency: item.incomingType, // Receive exchange
							secondCurrency: item.outgoingType,
							currentWallet: {
								address: item.deposit,
								currency: item.incomingType,
							},
							time: itemDate,
							url: item.transactionURL,
							value: item.incomingCoin,
							valueUSD: 0.0001,
							fee: item.Fee || 0,
							feeUSD: item.FeeUsd || 0,
							type: 'exchange-send',
						},
						{
							source: {
								From: item.deposit,
								To: null,
								...item,
							},
							currency: item.outgoingType, // Send exchange
							secondCurrency: item.incomingType,
							currentWallet: {
								address: item.withdraw,
								currency: item.outgoingType,
							},
							time: itemDate,
							url: item.transactionURL,
							value: item.outgoingCoin,
							valueUSD: 0.0001,
							fee: item.Fee || 0,
							feeUSD: item.FeeUsd || 0,
							type: 'exchange-receive',
						},
					].filter((item) => !!item.url);
				})
				.flat();

			return filterTransactionsByPaginationAndDate({
				transactions,
				transactionsPerPage: 20,
			});
		},
		GET_CRYPTO_FIAT_TRANSACTIONS: async () => {
			const { data } = await Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'TranzactionCryptoFiat',
					...getAuthParams(),
				},
			});
			const parsedData = Object.values(parsePythonArray(data)['1'].return.Info) || [];
			return parsedData.filter((item) => Object.values(item).length);
		},
		GET_ALL_TRANSACTIONS: async (store, { wallets }) => {
			const { commit, dispatch } = store;

			const [
				cryptoTransferTransactions,
				exchangeTransactions,
				cryptoFiatTransferTransactions,
			] = await Promise.all([
				dispatch('GET_CRYPTO_TRANSFER_TRANSACTIONS', { wallets }),
				dispatch('GET_CRYPTO_EXCHANGE_TRANSACTIONS'),
				dispatch('GET_CRYPTO_FIAT_TRANSACTIONS'),
			]);

			console.log(cryptoFiatTransferTransactions);

			const transactions = [
				{
					name: 'crypto-transfer',
					icon: {
						src: require('@/assets/images/transaction-sent.svg'),
						width: 15,
					},
					transactions: cryptoTransferTransactions,
				},
				{
					name: 'crypto-exchange',
					icon: {
						src: require('@/assets/images/transaction-exchange.svg'),
						width: 12,
					},
					transactions: exchangeTransactions,
				},
			];

			// const transactionsWithPagination = filterTransactionsByPaginationAndDate({
			// 	transactions,
			// 	transactionsPerPage: 20,
			// });

			commit('SET_ALL_TRANSACTIONS', transactions);
			return transactions;
		},
	},
};
