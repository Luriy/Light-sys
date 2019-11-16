import Axios from 'axios'
import { parsePythonArray } from '@/functions/helpers'
import { getAuthParams } from '@/functions/auth'
import { API_URL } from '@/constants'

export default {
  namespaced: true,
  state: {
    pageDetail: {
      currency: '',
      balance: 0,
      balanceUSD: 0
    },
    wallets: JSON.parse(localStorage.getItem('stateWalletsWallets')) || [],
    types: {},
    percentage: {},
    operations: [],
  },
  getters: {
    PAGE_DETAIL: state => state.pageDetail,
    WALLETS: state => state.wallets,
    TYPES: state => state.types,
    PERCENTAGE: state => state.percentage,
    OPERATIONS: state => state.operations,
  },
  mutations: {
    SET_PAGE_DETAIL: (state, payload) => (state.pageDetail = payload),
    SET_WALLETS: (state, payload) => {
      state.wallets = payload
      localStorage.setItem('stateWalletsWallets', JSON.stringify(payload))
    },
    UPDATE_WALLET: ({ wallets }, { wallet, amount }) => {
      wallets.find(item => {
        if (item.address === wallet) {
          item.balance = item.balance + amount
        }
      })
    },
    SET_TYPES: (state, payload) => (state.types = payload),
    SET_PERCENTAGE: (state, payload) => (state.percentage = payload),
    SET_OPERATIONS: (state, payload) => (state.operations = payload),
  },
  actions: {
    GET_PAGE_DETAIL: (store, { currency, address }) => {
      let Comand

      switch (currency.toUpperCase()) {
        case 'BTC':
          Comand = 'BalanceBTC'
          break
        case 'ETH':
          Comand = 'BalanceETH'
          break
        case 'LTC':
          Comand = 'BalanceETC'
          break
        default:
          throw new Error('Unknown currency')
      }

      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand,
          Wallet: address
        }
      }).then(({ data }) => {
        const returnData = parsePythonArray(data)['1'].return
        return store.commit('SET_PAGE_DETAIL', {
          currency: currency.toUpperCase(),
          balance: returnData.BalanceBTC
        })
      })
    },
    CREATE_WALLET: (store, type) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: `Add${type}wallet`,
          ...getAuthParams()
        }
      })
    },
    DELETE_WALLET: (state, payload) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: `FrozenWalet${payload.currency}`,
          Walet: payload.address,
          ...getAuthParams()
        }
      })
    },
    GET_WALLETS: ({ commit }) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: 'AllWalets',
          ...getAuthParams()
        }
      }).then(({ data }) => {
        const returnData = parsePythonArray(data)['1'].return

        const result = Object.keys(returnData)
          .reduce((acc, walletCurrency) => {
            acc.push(
              ...Object.values(returnData[walletCurrency]).map(item => ({
                address: item.Walet,
                status: item.Status,
                currency: walletCurrency,
                balance: item.Balance,
                balanceUSD: item.BalanceUsd
              }))
            )
            return acc
          }, [])
          .filter(({ status }) => status !== 'Frozen')

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

        return commit('SET_WALLETS', result)
      })
    },

    GET_TRANSFER_TOKEN: ({ commit }, user) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: 'TransferToken',
          ...user
        }
      })
    },
    POST_TRANSFER_CRYPTO: ({ commit }, { amount, from, to, token, currency }) => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: `${currency}Transfer`,
          ...getAuthParams(),
          From: from,
          To: to,
          Token: token,
          Amount: amount
        }
      }).then(({ data }) => {
        const response = parsePythonArray(data)
        const { Errors } = response[0]
        const responseData = response[1]
        if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
          commit('alerts/setNotification', {
            message: 'Transfer done',
            status: 'success-status',
            icon: 'done'
          },{root:true})
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

    GET_TYPES: async store => {
      const { data } = await Axios({
        url: API_URL,
        method: 'GET',
        params: {
          Comand: 'InfoCrypts'
        }
      })

      const responseData = parsePythonArray(data)['1'].return

      store.commit('SET_TYPES', {
        bitcoin: {
          name: 'Bitcoin',
          code: 'BTC',
          codeMarkup: 'btc',
          price: responseData['BTC: '].bitcoin.usd,
          change24h: responseData['BTC: '].bitcoin.usd_24h_change
        },
        ethereum: {
          name: 'Ethereum',
          code: 'ETH',
          codeMarkup: 'eth',
          price: responseData['ETH: '].ethereum.usd,
          change24h: responseData['ETH: '].ethereum.usd_24h_change
        },
        litecoin: {
          name: 'Litecoin',
          code: 'LTC',
          codeMarkup: 'ltc',
          price: responseData['LTC: '].litecoin.usd,
          change24h: responseData['LTC: '].litecoin.usd_24h_change
        }
      })

      store.commit('SET_PERCENTAGE', {
        BTC: {
          '1h': responseData['percentage_BTC: '].percentage_1h,
          '1y': responseData['percentage_BTC: '].percentage_1y,
          '7d': responseData['percentage_BTC: '].percentage_7d,
          '24d': responseData['percentage_BTC: '].percentage_24d,
          '30d': responseData['percentage_BTC: '].percentage_30d,
          '200d': responseData['percentage_BTC: '].percentage_200d
        },
        ETH: {
          '1h': responseData['percentage_ETH: '].percentage_1h,
          '1y': responseData['percentage_ETH: '].percentage_1y,
          '7d': responseData['percentage_ETH: '].percentage_7d,
          '24d': responseData['percentage_ETH: '].percentage_24d,
          '30d': responseData['percentage_ETH: '].percentage_30d,
          '200d': responseData['percentage_ETH: '].percentage_200d
        },
        LTC: {
          '1h': responseData['percentage_LTC: '].percentage_1h,
          '1y': responseData['percentage_LTC: '].percentage_1y,
          '7d': responseData['percentage_LTC: '].percentage_7d,
          '24d': responseData['percentage_LTC: '].percentage_24d,
          '30d': responseData['percentage_LTC: '].percentage_30d,
          '200d': responseData['percentage_LTC: '].percentage_200d
        }
      })
    },
    GET_OPERATIONS: async store => {
      const transactions = (await Promise.all(
        store.state.wallets.map(async wallet => {
          let Comand

          switch (wallet.currency) {
            case 'BTC':
              Comand = 'AllTransactionsBtc'
              break
            case 'ETH':
              Comand = 'AllTransactionsEth'
              break
            case 'LTC':
              Comand = 'AllTransactionsLtc'
              break
            default:
              throw new Error('Unknown currency')
          }

          const { data } = await Axios({
            url: API_URL,
            method: 'POST',
            params: {
              Comand,
              Wallet: wallet.address
            }
          })

          return Object.values(parsePythonArray(data)[1].return).map(item => ({
            source: item,
            currency: wallet.currency,
            address: item.address || item.To, // FIXME: Адрес не работает корректно
            time: new Date(parseInt(item.Timestamp, 10) + 1000),
            url: item.Url,
            value: item.value,
            valueUSD: item.valueUSD
          }))
        })
      )).flat()

      return store.commit('SET_OPERATIONS', transactions)
    }
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
  }
}
