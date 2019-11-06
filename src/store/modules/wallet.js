import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';

export default {
  namespaced: true,
  state: {
    pageDetail: {
      currency: '',
      balance: 0,
      balanceUSD: 0,
    },
    wallets: JSON.parse(localStorage.getItem('stateWalletsWallets')) || [],
    types: {},
    percentage: {},
    operations: [],
    transferInfo: {},
    loading: false,
    notification: null
  },
  getters: {
    //todo убрать в отдельный стор
    loading (state) {
      return state.loading
    },
    notification (state) {
      return state.notification
    },
    PAGE_DETAIL: state => state.pageDetail,
    WALLETS: state => state.wallets,
    TYPES: state => state.types,
    PERCENTAGE: state => state.percentage,
    OPERATIONS: state => state.operations,
    TRANSFERINFO: state => state.transferInfo,
  },
  mutations: {
    //todo убрать в отдельный стор
    setLoading (state, payload) {
      state.loading = payload
    },
    setNotification (state, payload) {
      state.notification = payload
    },
    clearNotification (state) {
      state.notification = null
    },
    SET_PAGE_DETAIL: (state, payload) => state.pageDetail = payload,
    SET_WALLETS: (state, payload) => {
      state.wallets = payload;
      localStorage.setItem('stateWalletsWallets', JSON.stringify(payload));
    },
    UPDATE_WALLET({wallets}, {wallet, amount}) {
      wallets.find(item => {
        if (item.address === wallet) {
          item.balance = item.balance + amount
        }
      })
    },
    SET_TYPES: (state, payload) => state.types = payload,
    SET_PERCENTAGE: (state, payload) => state.percentage = payload,
    SET_OPERATIONS: (state, payload) => state.operations = payload,
    SET_TRANSFER_INFO: (state, payload) => state.transferInfo = payload
  },
  actions: {
    //todo убрать в отдельный стор
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    },
    setNotification ({commit}, payload) {
      commit('setNotification', payload)
    },
    clearNotification ({commit}) {
      commit('clearNotification')
    },
    GET_PAGE_DETAIL: (store, { currency, address }) => {
      let Comand;

      switch (currency.toUpperCase()) {
        case 'BTC': Comand = 'BalanceBTC'; break;
        case 'ETH': Comand = 'BalanceETH'; break;
        default: throw 'Unknown currency';
      }

      return Axios({
        // todo Вынести домен в константы
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand,
          Wallet: address,
        },
      }).then(({data}) => {
        const returnData = parsePythonArray(data)['1'].return;

        console.log(returnData);

        return store.commit('SET_PAGE_DETAIL', {
          currency: currency.toUpperCase(),
          balance: returnData.BalanceBTC,
        });
      });
    },
    GET_WALLETS: ({commit}) => {
      return Axios({
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand: 'AllWalets',
          ...getAuthParams(),
        }
      }).then(({data}) => {
        // commit('setNotification', {message: 'wallets added', status: 'info-status', icon: 'error_outline'});
        // commit('setNotification', {message: 'wallets added', status: 'error-status', icon: 'close'});
        // commit('setNotification', {message: 'wallets added', status: 'sucess-status', icon: 'done'});
        // commit('setNotification', {message: 'wallets added', status: 'warning-status', icon: 'warning'});
        const returnData = parsePythonArray(data)['1'].return;

        const result = Object.keys(returnData).reduce((acc, walletCurrency) => {
          acc.push(...Object.values(returnData[walletCurrency]).map(item => ({
            address: item.Walet,
            status: item.Status,
            currency: walletCurrency,
            balance: item.Balance,
            balanceUSD: item.BalanceUsd,
          })));
          return acc;
        }, []);

        return commit('SET_WALLETS', result);
      });
    },

    GET_TRANSFER_INFO: ({commit}, {exchange, receive}) => {
      return Axios({
        url: 'https://apidomenpyth.ru',
        method: 'GET',
        params: {
          Comand: `TransferInfo${exchange}${receive}`,
        }
      }).then(({data}) => {
        const {Result: result} = parsePythonArray(data)['1'].return;
        return commit('SET_TRANSFER_INFO', result);
      });
    },

    GET_TRANSFER_TOKEN: ({commit}, user) => {
      return Axios({
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand: 'TransferToken',
          ...user
        }
      }).then(({data}) => {
        const {Email, Phone} = parsePythonArray(data)['1'].return;
        commit('setNotification', {message: Email ? Email : Phone, status: 'info-status', icon: 'error_outline'});
        // commit('setNotification', {message: Email ? Email : Phone, status: 'error-status', icon: 'close'});
        // commit('setNotification', {message: Email ? Email : Phone, status: 'sucess-status', icon: 'done'});
        // commit('setNotification', {message: Email ? Email : Phone, status: 'warning-status', icon: 'warning'});
      });
    },
    POST_TRANSFER: ({commit}, {transferData, pair: {exchange, receive}}) => {
      return Axios({
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand: `${exchange}${receive}Transfer`,
          ...transferData
        }
      }).then((resp) => {
        resp = eval("("+resp['data']+")");
        if (!resp[0]['Errors']['1007'] &&
          !resp[0]['Errors']['1010'] &&
          !resp[0]['Errors']['1011'] &&
          !resp[0]['Errors']['1012'] &&
          !resp[0]['Errors']['1013'] &&
          !resp[0]['Errors']['1014']
        ) {
          commit('UPDATE_WALLET', {wallet: transferData.To, amount: transferData.Amount});
          // const {Result: result} = parsePythonArray(resp)['1'].return;
          console.log(resp);
        } else {
          const err = resp[0]['Errors'],
                errKey = Object.keys(resp[0]['Errors'])[0];
          console.log(err[errKey]);
          commit('setError', {message: err[errKey], status: 'error'})
        }
      });
    },
    GET_TYPES: async store => {
      const { data } = await Axios({
        url: 'https://apidomenpyth.ru',
        method: 'GET',
        params: {
          Comand: 'InfoCrypts',
        }
      });

      const responseData = parsePythonArray(data)['1'].return;

      store.commit('SET_TYPES', {
        bitcoin: {
          name: 'Bitcoin',
          code: 'BTC',
          codeMarkup: 'btc',
          price: responseData['BTC: '].bitcoin.usd,
          change24h: responseData['BTC: '].bitcoin.usd_24h_change,
        },
        ethereum: {
          name: 'Ethereum',
          code: 'ETH',
          codeMarkup: 'eth',
          price: responseData['ETH: '].ethereum.usd,
          change24h: responseData['ETH: '].ethereum.usd_24h_change,
        },
        litecoin: {
          name: 'Litecoin',
          code: 'LTC',
          codeMarkup: 'ltc',
          price: responseData['LTC: '].litecoin.usd,
          change24h: responseData['LTC: '].litecoin.usd_24h_change,
        },
      });

      store.commit('SET_PERCENTAGE', {
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
      });
    },
    GET_OPERATIONS: async store => {
      const transactions = (await Promise.all(store.state.wallets.map(async wallet => {
        let Comand;

        switch (wallet.currency) {
          case 'BTC': Comand = 'AllTransactionsBtc'; break;
          case 'ETH': Comand = 'AllTransactionsEth'; break;
          default: throw 'Unknown currency';
        }

        const { data } = await Axios({
          url: 'https://apidomenpyth.ru',
          method: 'POST',
          params: {
            Comand,
            Wallet: wallet.address
          }
        });

        console.log(parsePythonArray(data)[1].return);

        return Object.values(parsePythonArray(data)[1].return).map(item => ({
          source: item,
          currency: wallet.currency,
          address: item.address || item.To, // FIXME: Адрес не работает корректно
          time: new Date(parseInt(item.Timestamp, 10) + 1000),
          url: item.Url,
          value: item.value,
          valueUSD: item.valueUSD,
        }));
      }))).flat();

      // console.log(transactions);

      transactions.forEach(item => console.log(item.currency));

      return store.commit('SET_OPERATIONS', transactions);
    },
    // SEND: (store, { currency, from, to, amount }) => {
    //   Axios({
    //     url: 'https://apidomenpyth.ru',
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
}
