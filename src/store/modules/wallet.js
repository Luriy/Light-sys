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
  },
  getters: {
    PAGE_DETAIL: state => state.pageDetail,
    WALLETS: state => state.wallets,
    TYPES: state => state.types,
    PERCENTAGE: state => state.percentage,
    OPERATIONS: state => state.operations,
  },
  mutations: {
    SET_PAGE_DETAIL: (state, payload) => state.pageDetail = payload,
    SET_WALLETS: (state, payload) => {
      state.wallets = payload;
      localStorage.setItem('stateWalletsWallets', JSON.stringify(payload));
    },
    SET_TYPES: (state, payload) => state.types = payload,
    SET_PERCENTAGE: (state, payload) => state.percentage = payload,
    SET_OPERATIONS: (state, payload) => state.operations = payload,
  },
  actions: {
    GET_PAGE_DETAIL: (store, { currency, address }) => {
      let Comand;

      switch (currency.toUpperCase()) {
        case 'BTC': Comand = 'BalanceBTC'; break;
        case 'ETH': Comand = 'BalanceETH'; break;
        default: throw 'Unknown currency';
      }

      return Axios({
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
    GET_WALLETS: store => {
      return Axios({
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand: 'AllWalets',
          ...getAuthParams(),
        }
      }).then(({data}) => {
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

        return store.commit('SET_WALLETS', result);
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
