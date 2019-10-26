<template>
  <lk-layout>
    <div :class="['send-block', this.$route.params.currency.toLowerCase()]">
      <div class="block-title">
        <div class="select">
          Send {{ currencyName }}
        </div>
        <img v-if="this.$route.params.currency.toUpperCase() === 'BTC'" src="@/assets/images/btc.png" alt title>
        <img v-if="this.$route.params.currency.toUpperCase() === 'ETH'" src="@/assets/images/eth.png" alt title>
        <router-link :to="{ name: 'LkPaymentWallet' }" class="close"><img src="@/assets/images/path.svg" alt title></router-link>
      </div>
      <div class="send-form">
        <div class="send-form-input">
          <input type="text" v-model="btc" :placeholder="`Send to ${ currencyName } address..`">
          <div class="qr"><img src="@/assets/images/bitmap-i.png" alt title></div>
        </div>
        <div class="send-form-input--amount">
        <input type="text" v-model="amount" placeholder="0.00001">
        <div class="btns">
          <button class="btn">Half</button>
          <button class="btn">All</button>
          <span>BTC</span>
        </div>
        </div>
      <div class="send-form-balance">
        <div class="current-balance"><input type="text" name="balace" placeholder="$10,000.00"></div>
        <div class="currency-balance">USD</div>
      </div>
      <div class="send-form-button">
        <button @click="onSend">Send</button>
      </div>
      <div class="send-form-totals">
        <div class="send-form-totals-total">
          <div class="text">Ethereum Network Fee</div>
          <div class="value">
            <span>0.00021 BTC</span>
            <span>$0.04</span>
          </div>
        </div>
        <div class="send-form-totals-total">
          <div class="text">Remaining Balance</div>
          <div class="value">
            <span>0 BTC</span>
            <span>$0.00</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
import Axios from 'axios';

export default {
  components: {
    LkLayout
  },
  data() {
    return {
      amount: null,
      btc: null
    }
  },
  computed: {
    currencyName() {
      let currencyName;

      switch (this.$route.params.currency.toUpperCase()) {
        case 'BTC': return 'Bitcoin';
        case 'ETH': return 'Ethereum';
        case 'LTC': return 'Litecoin';
        default: throw 'Unknown currency';
      }
    },
  },
  methods: {
    async onSend() {
      // this.$store.dispatch('wallet/SEND', {
      //   currency: this.$route.params.currency.toUpperCase(),
      //   from: '',
      //   to: '',
      //   amount: 123,
      // });
    }
  },
}
</script>
