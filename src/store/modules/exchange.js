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
    fiatInfo: {},
    exchangeSucces: false,
  },
  getters: {
    FIAT_PSIDS: state => state.fiatPsids,
    EXCHANGE_DATA: state => state.exchangeData,
    TRANSFER_INFO: state => state.transferInfo,
    FIAT_INFO: state => state.fiatInfo,
    EXCHANGE_SUCCES: state => state.exchangeSucces
  },
  mutations: {
    SET_FIAT_PSIDS: (state, payload) => (state.fiatPsids = payload),
    SET_EXCHANGE_DATA: (state, payload) => (state.exchangeData = payload),
    SET_TRANSFER_INFO: (state, payload) => (state.transferInfo = payload),
    SET_FIAT_INFO: (state, payload) => (state.fiatInfo = payload),
    SET_EXCHANGE_SUCCES: (state, payload) => (state.exchangeSucces = payload)
  },
  actions: {
    GET_TRANSFER_INFO: ({ commit }, { exchange, receive }) => {
      return Axios({
        url: API_URL,
        method: 'GET',
        params: {
          Comand: `TransferInfo${exchange}${receive}`
        }
      }).then(({ data }) => {
        const { Result: result } = parsePythonArray(data)['1'].return
        return commit('SET_TRANSFER_INFO', result)
      })
    },
    GET_FIAT_INFO: ({ commit }, { exchange, receive }) => {
      commit('alerts/setLoading', '#673AB7',{root:true});
      return Axios({
        url: API_URL,
        method: 'GET',
        params: {
          Comand: 'InfoPsid',
          Psid1: exchange,
          Psid2: receive,
          Ammount: '1',
          InfoCrypts: 'True'
        }
      }).then(({ data }) => {
        const {Errors} = parsePythonArray(data)['0'];
        if (!Object.keys(Errors).length) {
          commit('alerts/setLoading', false,{root:true});
          const result = parsePythonArray(data)['1'].return
          commit('SET_FIAT_INFO', result)
        } else {
          commit('alerts/setNotification', {
            message: errorsList[Object.keys(Errors)[0]],
            status: 'error-status',
            icon: 'close'
          },{root:true})
        }
      })
    },
    GET_FIAT_PSIDS: ({ commit }) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: 'FiatPsid',
        }
      }).then(({data}) => {
        const {Result: resultPsids} = parsePythonArray(data)['1'].return;
        const resultKeys = Object.keys(resultPsids);
        resultKeys.forEach(key => {
          resultPsids[key].name = decodeURIComponent(resultPsids[key].name)
        });
        commit('SET_FIAT_PSIDS', resultPsids)
      })
    },
    GET_FIAT_EXCHANGE: ({commit}) => {
      commit('alerts/setLoading', '#673AB7',{root:true});
      const baseRequest = {
        url: API_URL,
        method: 'POST',
      },
      fiatPsids = Axios({
        ...baseRequest,
        params: {
          Comand: 'FiatPsid',
        }
      }),
      allWallets = Axios({
        ...baseRequest,
        params: {
          Comand: 'AllWalets',
          ...getAuthParams()
        }
      }),
      cardsList = Axios({
        ...baseRequest,
        params: {
          Comand: 'CardInfo',
          ...getAuthParams()
        }
      });
      Promise.all([fiatPsids, allWallets, cardsList]).then(function(values) {
        commit('alerts/setLoading', false,{root:true});
        // const { Errors } = response[0];
        const parsedData = values.map(item => {
            return parsePythonArray(item.data)['1'].return
          }),
          [fiatResult, walletsResult, cardsResult] = parsedData,
          {Result: fiat} = fiatResult,
          {Cards: cards} = cardsResult,
          fiatKeys = Object.keys(fiat);

        fiatKeys.forEach(key => {
          fiat[key].name = decodeURIComponent(fiat[key].name)
        });
        const resultWallets = Object.keys(walletsResult)
          .reduce((acc, walletCurrency) => {
            acc.push(
              ...Object.values(walletsResult[walletCurrency]).map(item => ({
                ...currensyList[walletCurrency],
                number: item.Walet,
                status: item.Status,
                currency: walletCurrency,
                balance: item.Balance.toFixed(5),
                balanceUSD: item.BalanceUsd.toFixed(2),
                psid: +fiatKeys.filter(item =>(fiat[item].valute === walletCurrency))[0],
                isWallet: true
              }))
            );
            return acc
          }, [])
          .filter(({ status }) => status !== 'Frozen'),

        resultCards = Object.keys(cards).map(card => {
          const {name, reserve, valute} = fiat[+cards[card].Psid];
          return {
            fullName: name,
            icon: fiatList[+cards[card].Psid].icon.big,
            currency: valute,
            reserve,
            number: cards[card].Number,
            psid: +cards[card].Psid,
            holder: cards[card].Holder
          }
        });
        commit('SET_EXCHANGE_DATA', [...resultWallets, ...resultCards]);
      });
    },
    POST_WALLETS: ({ commit }, { transferData, pair: { exchange, receive } }) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: `${exchange}${receive}Transfer`,
          ...transferData
        }
      }).then(({ data }) => {
        const response = parsePythonArray(data)
        const { Errors } = response[0]
        const responseData = response[1]
        if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
          commit('UPDATE_WALLET', { wallet: transferData.To, amount: transferData.Amount })
          commit('SET_EXCHANGE_SUCCES', true)
        } else if (Object.keys(Errors).length) {
          const errKey = Object.keys(Errors)[0]
          commit('alerts/setNotification', {
            message: Errors[errKey],
            status: 'error-status',
            icon: 'close'
          },{root:true})
        } else {
          commit('alerts/setNotification', {
            message: 'Unknown error',
            status: 'error-status',
            icon: 'close'
          },{root:true})
        }
      })
    },
    POST_FIAT: ({ commit }, data) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: 'CriptoFiatTransfer',
          ...data,
          // todo Убрать хардкод в будущем
          ...(!data.Email && {MailSender: 'Nikola@mail.ru'})
        }
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
      })
    },
    SET_SUCCES ({ commit }, value) {
      commit('SET_EXCHANGE_SUCCES', value)
    }
  }
}
