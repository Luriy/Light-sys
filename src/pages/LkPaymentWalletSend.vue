<template>
  <lk-layout>
    <payments-and-transfer>
      <div :class="['send-block', currency.toLowerCase()]">
        <div class="block-title">
          <div class="select">
            <span class="select__title" @click="isSelectWalletOpened = !isSelectWalletOpened">
              Send {{ currencyName(currency) }}
            </span>
            <transition name="fade">
              <div class="select__modal" v-show="isSelectWalletOpened">
                <div class="select__modal-item" v-for="wallet in wallets" :class="{ active: wallet.address == $route.params.address }" @click="handleSelectWallet(wallet.currency, wallet.address)">
                  <img v-if="wallet.currency === 'BTC'" width="17" src="@/assets/images/btc.png" />
                  <img v-if="wallet.currency === 'ETH'" width="17" src="@/assets/images/eth.png" />
                  <img v-if="wallet.currency === 'LTC'" width="17" src="@/assets/images/ltc.svg" />
                  <h2 class="select__modal-currency">{{ currencyName(wallet.currency) }}</h2>
                  <span class="select__modal-balance">{{ `${wallet.currency} ${formatCurrency(wallet.balance, '', 5)}` }}</span>
                  <span class="select__modal-balance-usd">{{ `$${formatCurrency(wallet.balanceUSD)} USD` }}</span>
                </div>
              </div>  
            </transition>
          </div>
          <img v-if="currency === 'BTC'" src="@/assets/images/btc.png" alt title>
          <img v-if="currency === 'ETH'" src="@/assets/images/eth.png" alt title>
          <img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" alt title>
          <router-link :to="{ name: 'LkPaymentWallet' }" class="close"><img src="@/assets/images/path.svg" alt title></router-link>
        </div>
        <div class="send-form">
          <div class="send-form-input">
            <input type="text" v-model="paymentAddress" :placeholder="`Send to ${ currencyName(currency) } address..`">
            <div class="qr"><img src="@/assets/images/bitmap-i.png" alt title></div>
          </div>
          <div class="send-form-input--amount">
          <input type="number" v-model="cryptoCurrencyAmount" @input="handleCryptoCurrencyAmount" :placeholder="cryptoCurrencyAmountPlaceholder" @click.once="isCryptoCurrencyAmountInputClicked = true">
          <div class="btns">
            <button class="btn" :class="{ active: activeButton === 'Half'}" @click="handleButton('Half')">Half</button>
            <button class="btn" :class="{ active: activeButton === 'All'}" @click="handleButton('All')">All</button>
            <span>{{ currency }}</span>
          </div>
          </div>
        <div class="send-form-balance">
          <div class="current-balance"><span>$</span> <input type="number" v-model="currencyAmount" name="balance" :placeholder="currencyAmountPlaceholder" @click.once="isCurrencyAmountInputClicked = true" @input="handleCurrencyAmount"></div>
          <div class="currency-balance">USD</div>
        </div>
        <div class="send-form-button">
          <button @click="onSend">Send</button>
        </div>
        <p class="send-form__error">
          {{ error }}
        </p>
        <div class="send-form-totals">
          <div class="send-form-totals-total">
            <div class="text">{{ currencyName(currency) }} Network Fee</div>
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
  .current-balance {
    width: 100%;
  }
  .current-balance input[name='balance'] {
    width: 90%;
  }
</style>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer'
import Axios from 'axios';
import { mapGetters } from 'vuex';
import { API_URL } from '../constants'
import { VALIDATE_AMOUNT_TRANSFER_EXCHANGE } from '../validation';

export default {
  components: {
    LkLayout,
    PaymentsAndTransfer
  },
  data() {
    return {
      cryptoCurrencyAmount: null,
      currencyAmount: null,
      remainingCurrency: 0,
      remainingCryptoCurrency: 0,
      paymentAddress: null,
      activeButton: null,
      isCryptoCurrencyAmountInputClicked: false,
      isCurrencyAmountInputClicked: false,
      isSelectWalletOpened: false,
      error: 1,
      sendPopup: false,
    }
  },
  mounted() {
    this.$store.dispatch('wallet/GET_WALLETS')
  },
  computed: {
    ...mapGetters({
      wallets: 'wallet/WALLETS',
    }),
    currentWallet() {
      if (this.$route.params.address === 'none') {
        const walletsBalancesArray = this.wallets.map(wallet => wallet.balanceUSD);
        const maxBalanceIndex = walletsBalancesArray.indexOf(Math.max.apply(null, walletsBalancesArray));
        const walletWithMaxBalance = this.wallets[maxBalanceIndex];
        console.log(walletWithMaxBalance)
        this.$router.replace({ params: { currency: walletWithMaxBalance.currency, address: walletWithMaxBalance.address }});
        return walletWithMaxBalance;
      } else {
        return this.wallets.find(wallet => wallet.address == this.$route.params.address)
      }
    },
    currency() {
      return this.$route.params.currency
    },
    initialBalance() {
      return {
        currency: this.currentWallet.balanceUSD,
        cryptoCurrency: this.currentWallet.balance,
        course: this.currentWallet.balanceUSD / this.currentWallet.balance
      }
    },
    cryptoCurrencyAmountPlaceholder() {
      return this.isCryptoCurrencyAmountInputClicked ? null : this.formatCurrency(this.initialBalance.cryptoCurrency, '', 8);
    },
    currencyAmountPlaceholder() {
      return this.isCurrencyAmountInputClicked ? null : this.formatCurrency(this.initialBalance.currency);
    },
  },
  methods: {
    clearData() {
      this.cryptoCurrencyAmount = null;
      this.currencyAmount = null;
      this.remainingCurrency = 0;
      this.remainingCryptoCurrency = 0;
      this.paymentAddress = null;
      this.activeButton = null;
      this.isCryptoCurrencyAmountInputClicked = false;
      this.isCurrencyAmountInputClicked = false;
      this.isSelectWalletOpened = false;
    },
    currencyName(currency) {
      let currencyName;

      switch (currency) {
        case 'BTC': return 'Bitcoin';
        case 'ETH': return 'Ethereum';
        case 'LTC': return 'Litecoin';
        default: throw 'Unknown currency';
      }
    },
    cryptoToCurrency(crypto) {
      return this.formatCurrency(Number(crypto) * this.initialBalance.course);
    },
    currencyToCrypto(currency) {
      return Number(currency) / this.initialBalance.course;
    },
    handleCurrencyAmount() {
      this.remainingCurrency = this.formatCurrency(this.initialBalance.currency - this.currencyAmount);
      this.remainingCryptoCurrency = this.formatCurrency(this.currencyToCrypto(this.initialBalance.currency - this.currencyAmount), '', 8);
      this.cryptoCurrencyAmount = this.formatCurrency(this.currencyToCrypto(this.currencyAmount), '', 8);
    },
    handleCryptoCurrencyAmount() {
      this.remainingCryptoCurrency = this.formatCurrency(Number(this.initialBalance.cryptoCurrency) - Number(this.cryptoCurrencyAmount), '', 8);

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

      this.currencyAmount = this.cryptoToCurrency(this.cryptoCurrencyAmount);
    },
    handleButton(name) {
      if (name !== this.activeButton) {
        this.activeButton = name;
      }
      else {
        this.activeButton = null;
      }
      if (name === 'All') {
        this.cryptoCurrencyAmount = this.formatCurrency(this.initialBalance.cryptoCurrency, '', 8);
        this.currencyAmount = this.formatCurrency(this.initialBalance.currency);
        this.remainingCryptoCurrency = this.formatCurrency(0, '', 8);
        this.remainingCurrency = this.formatCurrency(0);
      } else if (name === 'Half') {
        this.cryptoCurrencyAmount = this.formatCurrency(this.initialBalance.cryptoCurrency / 2, '', 8);
        this.currencyAmount = this.formatCurrency(this.initialBalance.currency / 2);
        this.remainingCryptoCurrency = this.formatCurrency(this.initialBalance.cryptoCurrency / 2, '', 8);
        this.remainingCurrency = this.formatCurrency(this.initialBalance.currency / 2);
      }
    },
    handleSelectWallet(currency, address) {
      this.clearData();
      this.$router.push(`/payments-and-transfer/send/${currency}/${address}`);
    },
    async onSend() {
      // this.$store.dispatch('wallet/SEND', {
      //   currency: this.$route.params.currency.toUpperCase(),
      //   from: '',
      //   to: '',
      //   amount: 123,
      // });
      // this.$store.dispatch()

      const validateError = VALIDATE_AMOUNT_TRANSFER_EXCHANGE(this.cryptoCurrency, initialBalance.cryptoCurrency);

      if (validateError === null) {
        this.error = null;
        console.log(submitted);
      } else {
        this.error = validateError;
      }
    },
  },
}
</script>
