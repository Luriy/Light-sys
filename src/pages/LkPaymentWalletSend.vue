<template>
  <lk-layout>
    <payments-and-transfer>
      <div :class="['send-block', currency.toLowerCase()]">
        <div class="block-title">
          <div class="select">
            Send {{ currencyName }}
          </div>
          <img v-if="currency === 'BTC'" src="@/assets/images/btc.png" alt title>
          <img v-if="currency === 'ETH'" src="@/assets/images/eth.png" alt title>
          <img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" alt title>
          <router-link :to="{ name: 'LkPaymentWallet' }" class="close"><img src="@/assets/images/path.svg" alt title></router-link>
        </div>
        <div class="send-form">
          <div class="send-form-input">
            <input type="text" v-model="paymentAddress" :placeholder="`Send to ${ currencyName } address..`">
            <div class="qr"><img src="@/assets/images/bitmap-i.png" alt title></div>
          </div>
          <div class="send-form-input--amount">
          <input type="number" v-model="cryptoCurrencyAmount" @input="handleCryptoCurrencyAmount" :placeholder="initialBalance.cryptoCurrency">
          <div class="btns">
            <button class="btn" :class="{ active: activeButton === 'Half'}" @click="handleButton('Half')">Half</button>
            <button class="btn" :class="{ active: activeButton === 'All'}" @click="handleButton('All')">All</button>
            <span>{{ currency }}</span>
          </div>
          </div>
        <div class="send-form-balance">
          <div class="current-balance"><input type="number" v-model="currencyAmount" name="balace" :placeholder="`$${formatCurrency(initialBalance.currency)}`"></div>
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
              <span>{{ `${remainingCryptoCurrency} ${currency}` }} </span>
              <span>${{ remainingCurrency }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </payments-and-transfer>
  </lk-layout>
</template>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer'
import Axios from 'axios';
import { mapGetters } from 'vuex'

export default {
  components: {
    LkLayout,
    PaymentsAndTransfer
  },
  data() {
    return {
      currency: this.$route.params.currency,
      cryptoCurrencyAmount: null,
      currencyAmount: null,
      remainingCurrency: 0,
      remainingCryptoCurrency: 0,
      paymentAddress: null,
      activeButton: null,
    }
  },
  async mounted() {
    await this.$store.dispatch('common/GET_ALL_BALANCE')
  },
  computed: {
    ...mapGetters({
      allBalance: 'common/ALL_BALANCE',
    }),
    initialBalance() {
      switch (this.currency) {
        case 'BTC':
          return {
            currency: this.allBalance.BTCBalanceusd,
            cryptoCurrency: this.allBalance.BTCBalance,
          }
        case 'ETH':
          return {
            currency: this.allBalance.ETHBalanceusd,
            cryptoCurrency: this.allBalance.ETHBalance,
          }
        case 'LTC':
          return {
            currency: this.allBalance.LTCBalanceusd,
            cryptoCurrency: this.allBalance.LTCBalance,
          }
      }
    },
    currencyName() {
      let currencyName;

      switch (this.currency) {
        case 'BTC': return 'Bitcoin';
        case 'ETH': return 'Ethereum';
        case 'LTC': return 'Litecoin';
        default: throw 'Unknown currency';
      }
    },
  },
  methods: {
    handleCurrencyAmount() {
      this.remainingCurrency = this.initialBalance.currency - this.currencyAmount;
    },
    handleCryptoCurrencyAmount() {
      this.remainingCryptoCurrency = (Number(this.initialBalance.cryptoCurrency) - Number(this.cryptoCurrencyAmount)).toFixed(8);

      if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency) {
        this.activeButton = 'All';
      }
      else {
        this.activeButton = null;
      }

      if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency / 2) {
        this.activeButton = 'Half';
      }
      else {
        this.activeButton = null;
      }
    },
    handleButton(name) {
      if (name !== this.activeButton) {
        this.activeButton = name;
      }
      else {
        this.activeButton = null;
      }
      if (name === 'All') {
        this.cryptoCurrencyAmount = this.initialBalance.cryptoCurrency;
        this.remainingCryptoCurrency = 0;
      } else if (name === 'Half') {
        this.cryptoCurrencyAmount = this.initialBalance.cryptoCurrency / 2;
        this.remainingCryptoCurrency = this.initialBalance.cryptoCurrency / 2;
      }
    },
    async onSend() {
      // this.$store.dispatch('wallet/SEND', {
      //   currency: this.$route.params.currency.toUpperCase(),
      //   from: '',
      //   to: '',
      //   amount: 123,
      // });
    },
  },
}
</script>
