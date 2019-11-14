import Axios from 'axios'
import { parsePythonArray } from '@/functions/helpers'
import { getAuthParams } from '@/functions/auth'
import { API_URL } from '@/constants'
import fiatList from "../../settings/fiatList";
import currensyList from "../../settings/currensyList";

export default {
  namespaced: true,
  state: {
    fiatPsids: {}
  },
  getters: {
    FIAT_PSIDS: state => state.fiatPsids
  },
  mutations: {
    SET_FIAT_PSIDS: (state, payload) => (state.fiatPsids = payload),
  },
  actions: {
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
                balance: item.Balance,
                balanceUSD: item.BalanceUsd
              }))
            );
            return acc
          }, [])
          .filter(({ status }) => status !== 'Frozen'),

        resultCards = Object.keys(cards).map(card => {
          const {name, reserve, valute} = fiat[+cards[card].Psid];
          return {
            fullName: name,
            icon: fiatList[+cards[card].Psid].icon,
            currency: valute,
            reserve,
            number: cards[card].Number,
            psid: +cards[card].Psid
          }
        });

        console.log('fiat, cards', fiat, cards);
        console.log([...resultWallets, ...resultCards]);
      });
    }
  }
}
