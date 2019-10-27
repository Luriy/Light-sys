<template>
  <lk-layout>
    <button class="add-token">
      Add token
    </button>
    <div class="crypto-wallets">
      <div class="title">
        <p>Create wallet</p>
        <router-link to="/wallets"><div class="close"><img src="@/assets/images/path.svg" alt title></div></router-link>
      </div>
      <table class="crypto-wallets_table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Asset name</th>
            <th>Price</th>
            <th>24H Change</th>
            <th>30 Day Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types" :key="type.code" @click="addWallet(type.code)">
            <td>
              <div class="currency">
                <div class="icon">
                  <img v-if="type.codeMarkup === 'btc'" src="@/assets/images/btc.png" alt title>
                  <img v-if="type.codeMarkup === 'eth'" src="@/assets/images/eth.png" alt title>
                </div>
                <div :class="['text', type.codeMarkup]">
                  <p>{{ type.name }}</p>
                  <span>{{ type.code }}</span>
                </div>
              </div>
            </td>
            <td>{{ formatCurrency(type.price, '$') }}</td>
            <td>{{ type.change24h | changePercent }}</td>
            <td><div class="progress"><img src="@/assets/images/graph-yellow.svg" alt title></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import Axios from 'axios';
import LkLayout from '@/layout/LkLayout';
import { getAuthParams } from '@/functions/auth';

export default {
  name: 'LkPaymentWalletsCreate',
  computed: {
    ...mapGetters({
      types: 'wallet/TYPES',
    })
  },
  filters: {
    changePercent: value => `${value.toFixed(2)}%`,
  },
  mounted() {
    this.$store.dispatch('wallet/GET_TYPES');
  },
  methods: {
    addWallet(code) {
      let Comand;

      switch(code) {
        case 'BTC': Comand = 'AddBTCwallet'; break;
        case 'ETH': Comand = 'AddETHwallet'; break;
        default: throw 'Code not found';
      }

      Axios({
        url: 'https://apidomenpyth.ru',
        method: 'POST',
        params: {
          Comand,
          ...getAuthParams(),
        },
      }).then(({data}) => {
        console.log(data);
        alert('Кошелек успешно добавлен!');
        this.$router.push('/wallets');
      }).catch(reason => {
        console.log(reason);
      });
    }
  },
  components: {
    LkLayout
  },
}
</script>
