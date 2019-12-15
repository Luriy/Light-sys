import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import fiatList from '../../settings/fiatList';
import currensyList from '../../settings/currensyList';
import errorsList from '../../settings/errorsList';

export default {
	namespaced: true,
	state: {
		fiatPsids: {},
		exchangeData: [],
		transferInfo: {},
    availableWalletDirections: {},
		fiatInfo: {},
    fiatData: {},
		exchangeSucces: false,
	},
	getters: {
		FIAT_PSIDS: (state) => state.fiatPsids,
		EXCHANGE_DATA: (state) => state.exchangeData,
		TRANSFER_INFO: (state) => state.transferInfo,
		FIAT_INFO: (state) => state.fiatInfo,
		FIAT_DATA: (state) => state.fiatData,
		EXCHANGE_SUCCES: (state) => state.exchangeSucces,
    AVAILABLE_WALLET_DIRECTIONS: (state) => state.availableWalletDirections,
	},
	mutations: {
		SET_FIAT_PSIDS: (state, payload) => (state.fiatPsids = payload),
		SET_EXCHANGE_DATA: (state, payload) => (state.exchangeData = payload),
		SET_TRANSFER_INFO: (state, payload) => (state.transferInfo = payload),
		SET_FIAT_INFO: (state, payload) => (state.fiatInfo = payload),
    SET_FIAT_DATA: (state, payload) => (state.fiatData = payload),
		SET_EXCHANGE_SUCCES: (state, payload) => (state.exchangeSucces = payload),
    SET_AVAILABLE_WALLET_DIRECTIONS: (state, payload) => (state.availableWalletDirections = payload),
    UPDATE_FIAT_DIRECTION_STATUS: (state, directions) => {
      state.fiatData.forEach(item => {
        if (directions.some(direction => (direction === item.psid))) {
          item.directionStatus = 0
        } else {
          item.directionStatus = 1
        }
      });
      state.exchangeData.forEach(item => {
        if (directions.some(direction => (direction === item.psid))) {
          item.directionStatus = 0
        } else {
          item.directionStatus = 1
        }
      });
    },
    UPDATE_WALLETS_DIRECTION_STATUS: (state, { direction, receive }) => {
      state.exchangeData.forEach(item => {
        if (item.isWallet && item.currency === receive) {
          item.directionStatus = state.availableWalletDirections[direction]
        }
      });
    },
    CLEAR_DIRECTIONS: (state) => {
      state.fiatData.forEach(item => {
        item.directionStatus = 0;
      });
      state.exchangeData.forEach(item => {
        item.directionStatus = 0;
      });
    }
	},
	actions: {
		GET_TRANSFER_INFO: ({ commit }, { exchange, receive }) => {
			return Axios({
				url: API_URL,
				method: 'GET',
				params: {
					Comand: `TransferInfo${exchange}${receive}`,
				},
			}).then(({ data }) => {
				const { Result: result } = parsePythonArray(data)['1'].return;
				return commit('SET_TRANSFER_INFO', result);
			});
		},
    SET_FIAT_DIRECTIONS: ({ commit }, directions) => {
      commit('CLEAR_DIRECTIONS');
      commit('UPDATE_FIAT_DIRECTION_STATUS', directions);
    },
    SET_WALLET_DIRECTIONS: ({ commit }, direction) => {
      commit('CLEAR_DIRECTIONS');
      commit('UPDATE_WALLETS_DIRECTION_STATUS', direction);
    },
		GET_FIAT_INFO: ({ commit }, { exchange, receive }) => {
			commit('alerts/setLoading', '#673AB7', { root: true });
			return Axios({
				url: API_URL,
				method: 'GET',
				params: {
					Comand: 'InfoPsid',
					Psid1: exchange,
					Psid2: receive,
					Ammount: '1',
					InfoCrypts: 'True',
				},
			}).then(({ data }) => {
				const { Errors } = parsePythonArray(data)['0'];
				if (!Object.keys(Errors).length) {
                    const result = parsePythonArray(data)['1'].return;
                    commit('alerts/setLoading', false, { root: true });
					commit('SET_FIAT_INFO', result);
				} else {
					commit('alerts/setLoading', false, { root: true });
					commit(
						'alerts/setNotification',
						{
							message: errorsList[Object.keys(Errors)[0]],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
				}
			});
		},
		GET_FIAT_PSIDS: ({ commit }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'FiatPsid',
				},
			}).then(({ data }) => {
				const { Result: resultPsids } = parsePythonArray(data)['1'].return;
				const resultKeys = Object.keys(resultPsids);
				resultKeys.forEach((key) => {
					resultPsids[key].name = decodeURIComponent(resultPsids[key].name);
				});
				commit('SET_FIAT_PSIDS', resultPsids);
			});
		},
		GET_FIAT_EXCHANGE: ({ commit }) => {
			commit('alerts/setLoading', '#673AB7', { root: true });
			const baseRequest = {
				url: API_URL,
				method: 'POST',
			};
			const fiatPsids = Axios({
				...baseRequest,
				params: {
					Comand: 'FiatPsid',
				},
			});
			const allWallets = Axios({
				...baseRequest,
				params: {
					Comand: 'AllWalets',
					...getAuthParams(),
				},
			});
			const cardsList = Axios({
				...baseRequest,
				params: {
					Comand: 'CardInfo',
					...getAuthParams(),
          StatusExchange: 1
				},
			});
			Promise.all([fiatPsids, allWallets, cardsList]).then(function(values) {
				commit('alerts/setLoading', false, { root: true });
				// const { Errors } = response[0];
				const parsedData = values.map((item) => {
						return parsePythonArray(item.data)['1'].return;
					});
				const [fiatResult, walletsResult, cardsResult] = parsedData;
				const	{ Result: fiat } = fiatResult;
				const	{ Cards: cards } = cardsResult;
				const	fiatKeys = Object.keys(fiat);
				const currencyKeys = Object.keys(currensyList);

        fiatKeys.forEach((key) => {
					fiat[key].name = decodeURIComponent(fiat[key].name);
				});

        const resultWallets = currencyKeys.reduce((acc, currencyKey) => ([...acc, Object.values(walletsResult[currencyKey]).map(item => ({
            ...currensyList[currencyKey],
            number: item.Walet,
            status: item.Status,
            statusNode: walletsResult[`StatusNode${currencyKey}`],
            directionStatus: 0,
            currency: currencyKey,
            balance: item.Balance ? item.Balance.toFixed(5) : '0.00',
            balanceUSD: item.BalanceUsd ? item.BalanceUsd.toFixed(2) : '0.00',
            psid: +fiatKeys.find((item) => fiat[item].valute === currencyKey),
            isWallet: true,
          }))]), []).reduce((acc, res) => acc.concat(res.filter(({ status }) => status !== 'Frozen')), []);

        const	resultCards = Object.keys(cards).map((card) => {
						const { name, reserve, valute } = fiat[+cards[card].Psid];
						return {
							fullName: name,
							icon: fiatList[cards[card].Psid] && fiatList[cards[card].Psid].icon.big
                ? fiatList[+cards[card].Psid].icon.big
                : fiatList['111'].icon.big,
							currency: valute,
							reserve,
              statusNode: cards[card].StatusExchange,
              directionStatus: 0,
              status: cards[card].Status,
							number: cards[card].Number,
							psid: +cards[card].Psid,
							holder: cards[card].Holder,
              ...(!cards[card].StatusExchange && { directions: Object.values(cards[card].ExchangeVariable) })
						};
					}).filter(({ status }) => status !== 'Frozen');

        const resultPsids = Object.keys(fiat).map(item => {
          return {
            name: fiat[item].name,
            psid: fiat[item].psid,
            directionStatus: 0,
            icon: fiatList[fiat[item].psid] && fiatList[fiat[item].psid].icon.big ? fiatList[fiat[item].psid].icon.big : fiatList['111'].icon.big,
            currency: fiat[item].valute,
            reserve: fiat[item].reserve
          }
        });

        commit('SET_EXCHANGE_DATA', [...resultWallets, ...resultCards]);
        commit('SET_FIAT_DATA', resultPsids);
        commit('SET_AVAILABLE_WALLET_DIRECTIONS', walletsResult.StatusCryptoExchange);
			});
		},
		POST_WALLETS: ({ commit }, { transferData, pair: { exchange, receive } }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: `${exchange}${receive}Transfer`,
					...transferData,
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1];
				if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
					commit('UPDATE_WALLET', { wallet: transferData.To, amount: transferData.Amount });
					commit('SET_EXCHANGE_SUCCES', true);
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
		POST_FIAT: ({ commit }, data) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CriptoFiatTransfer',
					...data,
					// todo Убрать хардкод в будущем
					...(!data.Email && { MailSender: 'Nikola@mail.ru' }),
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1];
				console.log('Errors', Errors);
				console.log('responseData', responseData);
				// if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
				//   commit('UPDATE_WALLET', { wallet: transferData.To, amount: transferData.Amount })
				//   commit('SET_EXCHANGE_SUCCES', true)
				// } else if (Object.keys(Errors).length) {
				//   const errKey = Object.keys(Errors)[0]
				//   commit('alerts/setNotification', {
				//     message: Errors[errKey],
				//     status: 'error-status',
				//     icon: 'close'
				//   },{root:true})
				// } else {
				//   commit('alerts/setNotification', {
				//     message: 'Unknown error',
				//     status: 'error-status',
				//     icon: 'close'
				//   },{root:true})
				// }
			});
		},
		SET_SUCCES({ commit }, value) {
			commit('SET_EXCHANGE_SUCCES', value);
		},
	},
};
