import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
import filterTransactionsByPaginationAndDate from '@/functions/filterTransactionsByPaginationAndDate';
import formatCardNumber from '@/functions/formatCardNumber';
import getWalletBlockchainLink from '@/functions/getWalletBlockchainLink';

export default {
	namespaced: true,
	state: {
		transactions: JSON.parse(localStorage.getItem('stateWalletsTransactions')) || [],
		allFilteredTransactions: [],
		allFilteredSingleTransactions: [],
		allSingleWalletTransactions:
			JSON.parse(localStorage.getItem('StateSingleWalletsTransactions')) || [],
	},
	getters: {
		ALL_TRANSACTIONS: (state) => state.transactions,
		ALL_FILTERED_TRANSACTIONS: (state) => state.allFilteredTransactions,
		ALL_FILTERED_SINGLE_TRANSACTIONS: (state) => state.allFilteredSingleTransactions,
		ALL_SINGLE_WALLET_TRANSACTIONS: (state) => state.allSingleWalletTransactions,
	},
	mutations: {
		SET_ALL_TRANSACTIONS: (state, payload) => {
			state.transactions = payload;
			localStorage.setItem('stateWalletsTransactions', JSON.stringify(payload));
		},
		SET_ALL_FILTERED_TRANSACTIONS: (state, payload) => {
			state.allFilteredTransactions = payload;
		},
		SET_ALL_FILTERED_SINGLE_TRANSACTIONS: (state, payload) => {
			state.allFilteredSingleTransactions = payload;
		},
	},
	actions: {
		GET_CRYPTO_TRANSFER_TRANSACTIONS: async ({ commit, state }, { wallets, singleWallet }) => {
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

								const transaction = {
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

								return transaction;
							});

							localStorage.setItem(
								`StateSingleTransactionsTransfer${wallet.address}`,
								JSON.stringify(transactions),
							);

							return transactions;
						}),
					)
				).flat() || [];

			singleWallet
				? commit('SET_ALL_FILTERED_SINGLE_TRANSACTIONS', [
						...state.allFilteredSingleTransactions,
						...transactions,
				  ])
				: commit('SET_ALL_FILTERED_TRANSACTIONS', [
						...state.allFilteredTransactions,
						...transactions,
				  ]);

			return filterTransactionsByPaginationAndDate({
				transactions: transactions,
				transactionsPerPage: 20,
			});
		},
		GET_CRYPTO_EXCHANGE_TRANSACTIONS: async ({ commit, state, rootState }, { singleWallet }) => {
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
				.filter((transaction) =>
					singleWallet
						? (transaction.withdraw ? transaction.withdraw.toLowerCase() : false) ===
								singleWallet.address ||
						  (transaction.deposit ? transaction.deposit.toLowerCase() : false) ===
								singleWallet.address
						: true,
				)
				.map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					return {
						source: {
							To: item.withdraw || null,
							From: item.deposit || null,
							...item,
						},
						currency: item.incomingType, // Receive exchange
						secondCurrency: item.outgoingType,
						time: itemDate,
						url: item.transactionURL,
						value: Number(item.incomingCoin),
						secondValue: Number(item.outgoingCoin),
						valueUSD: Number(item.incomingUSD),
						secondValueUSD: Number(item.outcomingUSD),
						fee: item.incomingCoin - item.outcomingUSD * (item.incomingCoin / item.incomingUSD),
						feeUSD: item.incomingUSD - item.outcomingUSD,
						type: 'exchange',
					};
				})
				.filter((item) => !!item.url);

			rootState.wallet.wallets.map((wallet) => {
				const walletTransactions = transactions.filter(
					({ source: { To, From } }) =>
						wallet.address.toLowerCase() === To.toLowerCase() ||
						wallet.address.toLowerCase() === From.toLowerCase(),
				);
				localStorage.setItem(
					`StateSingleTransactionsExchange${wallet.address}`,
					JSON.stringify(walletTransactions),
				);
			});

			singleWallet
				? commit('SET_ALL_FILTERED_SINGLE_TRANSACTIONS', [
						...state.allFilteredSingleTransactions,
						...transactions,
				  ])
				: commit('SET_ALL_FILTERED_TRANSACTIONS', [
						...state.allFilteredTransactions,
						...transactions,
				  ]);

			return filterTransactionsByPaginationAndDate({
				transactions,
				transactionsPerPage: 20,
			});
		},
		GET_CRYPTO_FIAT_TRANSACTIONS: async (
			{ dispatch, commit, state, rootState },
			{ singleWallet },
		) => {
			const [{ data }, allPsids] = await Promise.all([
				Axios({
					url: API_URL,
					method: 'POST',
					params: {
						Comand: 'TranzactionCryptoFiat',
						...getAuthParams(),
					},
				}),
				dispatch('exchange/GET_FIAT_PSIDS', {}, { root: true }),
			]);

			const parsedData = Object.values(parsePythonArray(data)['1'].return.Info) || [];
			let transactions = parsedData.filter((item) => Object.values(item).length);

			if (singleWallet) {
				transactions = transactions.filter(
					(transaction) =>
						(transaction.from ? transaction.from.toLowerCase() : false) ===
							singleWallet.address.toLowerCase() ||
						(transaction.to ? transaction.to.toLowerCase() : false) ===
							singleWallet.address.toLowerCase(),
				);
			}

			transactions = transactions
				.map((item) => {
					const itemDate = new Date(parseInt(item.Timestamp, 10) * 1000);
					const psid1Info = Object.values(allPsids).find(
						({ name }) => name === decodeURI(item.psid1),
					);
					const psid2Info = Object.values(allPsids).find(({ name }) => {
						return name === decodeURI(item.psid2);
					});
					const isPsid1Fiat = !isNaN(item.psid1);
					return [
						{
							source: {
								To: isPsid1Fiat ? item.to : formatCardNumber(item.to) || null,
								From: null,
								...item,
							},
							currency: psid1Info.valute, // send transfer
							currentWallet: {
								address: item.from,
								currency: psid1Info.valute,
							},
							isCard: isPsid1Fiat,
							psid: psid1Info.psid,
							time: itemDate,
							value: item.in || 0,
							valueUSD: item.inUSD || 0,
							fee: item.in && item.out ? item.in - item.outUSD * (item.in / item.inUSD) : 0,
							feeUSD: item.inUSD && item.outUSD ? item.inUSD - item.outUSD : 0,
							type: 'crypto-fiat-send',
							url: getWalletBlockchainLink(
								isPsid1Fiat ? psid2Info.valute : psid1Info.valute,
								isPsid1Fiat ? item.to : item.from,
							),
						},
						{
							source: {
								From: isPsid1Fiat ? formatCardNumber(item.from) : item.from || null,
								To: isPsid1Fiat ? item.to : formatCardNumber(item.to) || null,
								...item,
							},
							currency: psid2Info.valute, // receive transfer
							currentWallet: {
								address: item.from,
								currency: psid2Info.valute,
							},
							isCard: !isPsid1Fiat,
							psid: psid2Info.psid,
							time: itemDate,
							value: item.out || 0,
							valueUSD: item.outUSD || 0,
							type: 'crypto-fiat-receive',
							url: getWalletBlockchainLink(
								isPsid1Fiat ? psid2Info.valute : psid1Info.valute,
								isPsid1Fiat ? item.to : item.from,
							),
						},
					];
				})
				.flat();

			rootState.wallet.wallets.map((wallet) => {
				const walletTransactions = transactions.filter(
					({ source: { to, from }, isCard }) =>
						(wallet.address.toLowerCase() === (to ? to.toLowerCase() : null) ||
							wallet.address.toLowerCase() === (from ? from.toLowerCase() : null)) &&
						!isCard,
				);
				localStorage.setItem(
					`StateSingleTransactionsCryptoFiatTransfer${wallet.address}`,
					JSON.stringify(walletTransactions),
				);
			});

			singleWallet
				? commit('SET_ALL_FILTERED_SINGLE_TRANSACTIONS', [
						...state.allFilteredSingleTransactions,
						...transactions,
				  ])
				: commit('SET_ALL_FILTERED_TRANSACTIONS', [
						...state.allFilteredTransactions,
						...transactions,
				  ]);

			return filterTransactionsByPaginationAndDate({
				transactions,
				transactionsPerPage: 20,
			});
		},
		GET_TRANSACTIONS: async (store, { wallets, singleWallet }) => {
			const { commit, dispatch, getters } = store;
			commit('SET_ALL_FILTERED_SINGLE_TRANSACTIONS', []);
			commit('SET_ALL_FILTERED_TRANSACTIONS', []);

			const [
				cryptoTransferTransactions,
				exchangeTransactions,
				cryptoFiatTransferTransactions,
			] = await Promise.all([
				dispatch('GET_CRYPTO_TRANSFER_TRANSACTIONS', {
					wallets: singleWallet ? [singleWallet] : wallets,
					singleWallet: singleWallet,
				}),
				dispatch('GET_CRYPTO_EXCHANGE_TRANSACTIONS', {
					singleWallet,
				}),
				dispatch('GET_CRYPTO_FIAT_TRANSACTIONS', {
					singleWallet,
				}),
			]);

			const transactions = [
				{
					name: 'all',
					text: 'All',
					transactions: filterTransactionsByPaginationAndDate({
						transactions: singleWallet
							? getters.ALL_FILTERED_SINGLE_TRANSACTIONS
							: getters.ALL_FILTERED_TRANSACTIONS,
						transactionsPerPage: 20,
					}),
				},
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
				{
					name: 'crypto-fiat-transfer',
					icon: {
						src: require('@/assets/images/crypto-fiat-transfer.svg'),
						width: 18,
					},
					transactions: cryptoFiatTransferTransactions,
				},
			];

			if (!singleWallet) {
				commit('SET_ALL_TRANSACTIONS', transactions);
			}

			return transactions;
		},
		GET_SINGLE_WALLET_TRANSACTIONS: async (store, { address }) => {
			const transactions = [
				{
					name: 'all',
					text: 'All',
					transactions: filterTransactionsByPaginationAndDate({
						transactions: [
							...(JSON.parse(localStorage.getItem(`StateSingleTransactionsTransfer${address}`)) ||
								[]),
							...(JSON.parse(localStorage.getItem(`StateSingleTransactionsExchange${address}`)) ||
								[]),
							...(JSON.parse(
								localStorage.getItem(`StateSingleTransactionsCryptoFiatTransfer${address}`),
							) || []),
						],
						transactionsPerPage: 20,
					}),
				},
			];

			return transactions;
		},
	},
};
