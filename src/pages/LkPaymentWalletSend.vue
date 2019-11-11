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
          <img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" height="65" alt title>
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
          <button @click="onSendSms">Send</button>
          <div class="send-form__error-block">
            <transition name="fade">
              <p class="send-form__error" v-show="error">
                {{ error }}
              </p>
            </transition>
          </div>
        </div>
        
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
      <lk-pop-up
        v-if="sendPopup"
        class="transfer-popup"
        @closeModal="closeModal"
        :popupSize="{ width: '650px', height: '500px' }"
      >
        <div slot='title' class="exchange-popup_title">
          <img v-if="currency === 'BTC'" src="@/assets/images/btc.png" alt title>
          <img v-if="currency === 'ETH'" src="@/assets/images/eth.png" alt title>
          <img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" alt title>
          <p class="transaction">Confirmation <br> exchange {{ currencyAmount }} USD</p>
          <div class="phone-question" v-if="user.Phone">
            <p class="question">We sent an SMS confirmation to the number</p>
            <div class="number-block">
              <p class="number">{{user.Phone}}</p>
              <router-link class="link" to="/">Wrong number?</router-link>
            </div>
          </div>
          <div class="email-question" v-else>
            <p class="question">We sent an email confirmation to the email</p>
            <div class="number-block">
              <p class="number">{{user.Email}}</p>
              <router-link class="link" to="/">Wrong email?</router-link>
            </div>
          </div>
        </div>
        <div slot='smsNumber' class="exchange-popup_sms-number">
          <input
            class="number-input"
            v-for="(input, index) in smsCodes"
            v-model="input[index]"
            @keyup="index !== (smsCodes.length - 1) ? $event.target.nextElementSibling.focus() : onSend()"
            placeholder="_"
            type="text"
            maxLength="1"
            size="1"
            min="0"
            max="9" pattern="[0-9]{1}"
          />

          <div class="timer-body">
            <div class="title">Resend code:</div>
            <div class="timer">00:{{countdown}} Sec</div>
          </div>
        </div>
        <div slot='body' class="exchange-popup_body">
          <div class="exchange-popup_info">
            <div class="flex">
              <p class="from" :class="currency.toLowerCase()">{{ formatCurrency(cryptoCurrencyAmount, '', 8) }} {{ currency }}</p>
              <p class="payment-usd">${{ formatCurrency(currencyAmount) }}</p>
            </div>
            <img src="@/assets/images/send-arrow.svg" alt title>
            <p class="payment-address">{{ paymentAddress }}</p>
          </div>
          <div class="exchange-block_fee">
            <div class="network-fee">
              <p class="title"><span>{{ currency }}</span> Network Fee</p>
              <p class="btc-value">{{ 1 }} {{currency}}</p>
              <p class="fixed-value">${{ 0.12 }}</p>
            </div>
            <div class="balance">
              <p class="title">Remaining balance</p>
              <p class="btc-value">{{ remainingCryptoCurrency }} {{ currency }}</p>
              <p class="fixed-value">${{ remainingCurrency }}</p>
            </div>
          </div>
        </div>
        <div slot='buttons' class="exchange-popup_buttons">
          <button class="back" @click="closeModal">Back</button>
        </div>
      </lk-pop-up>
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
  .transfer-popup .payment-address {
    margin-right: 15px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  .transfer-popup .from {
    font-size: 14px;
    font-weight: 600;
  }
  .transfer-popup .payment-usd {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-left: 9px;
  }
  .transfer-popup .fixed-value {
    width: 90px;
    text-align: right;
  }
  .transfer-popup .btc-value {
    margin-right: 0 !important;
  }
  .exchange-popup_info img {
    left: 38% !important;
  }
  .exchange-popup_body {
    width: 570px !important;
  }
</style>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer'
import Axios from 'axios';
import { mapGetters } from 'vuex';
import { API_URL } from '../constants'
import { VALIDATE_AMOUNT_TRANSFER_EXCHANGE, VALIDATE_ADDRESS } from '../validation';
import { getAuthParams } from '@/functions/auth';
import LkPopUp from '@/layout/LkPopUp';

export default {
  components: {
    LkLayout,
    PaymentsAndTransfer,
    LkPopUp
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
      error: null,
      sendPopup: false,
      smsCodes: [
        {0: ''},
        {1: ''},
        {2: ''},
        {3: ''},
        {4: ''},
        {5: ''},
      ],
      timer: null,
      countdown: 59,
    }
  },
  mounted() {
    this.$store.dispatch('wallet/GET_WALLETS');
  },
  computed: {
    user() {
      return {...getAuthParams()}
    },
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
      this.error = null;
      this.sendPopup = false;
      this.smsCodes = [
        {0: ''},
        {1: ''},
        {2: ''},
        {3: ''},
        {4: ''},
        {5: ''},
      ],
      this.timer = null;
      this.countdown = 59;
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
      return (Number(crypto) * this.initialBalance.course).toFixed(2);
    },
    currencyToCrypto(currency) {
      return (Number(currency) / this.initialBalance.course).toFixed(8);
    },
    handleCurrencyAmount() {
      const remainingCurrency = (this.initialBalance.currency - this.currencyAmount).toFixed(2);
      this.remainingCurrency = remainingCurrency < 0 ? 0 : remainingCurrency;

      const remainingCryptoCurrency = this.currencyToCrypto(this.initialBalance.currency - this.currencyAmount)
      this.remainingCryptoCurrency = remainingCryptoCurrency < 0 ? 0 : remainingCryptoCurrency

      this.cryptoCurrencyAmount = this.currencyToCrypto(this.currencyAmount);
    },
    handleCryptoCurrencyAmount() {
      this.remainingCryptoCurrency = (this.initialBalance.cryptoCurrency - this.cryptoCurrencyAmount).toFixed(8);
      this.remainingCurrency = (this.initialBalance.currency - this.currencyAmount).toFixed(2);

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
        this.cryptoCurrencyAmount = this.initialBalance.cryptoCurrency.toFixed(8);
        this.currencyAmount = this.initialBalance.currency.toFixed(2);
        this.remainingCryptoCurrency = 0;
        this.remainingCurrency = 0;
      } else if (name === 'Half') {
        this.cryptoCurrencyAmount = (this.initialBalance.cryptoCurrency / 2).toFixed(8);
        this.currencyAmount =(this.initialBalance.currency / 2).toFixed(2);
        this.remainingCryptoCurrency = (this.initialBalance.cryptoCurrency / 2).toFixed(8);
        this.remainingCurrency = (this.initialBalance.currency / 2).toFixed(2);
      }
    },
    handleSelectWallet(currency, address) {
      this.clearData();
      this.$router.push(`/payments-and-transfer/send/${currency}/${address}`);
    },
    closeModal() {
      this.sendPopup = false;
      this.timeout = 59;
      clearInterval(this.timer);
    },
    onSendSms() {
      const validateErrorAmount = VALIDATE_AMOUNT_TRANSFER_EXCHANGE(this.cryptoCurrencyAmount, this.initialBalance.cryptoCurrency);
      const validateErrorAddress = VALIDATE_ADDRESS(this.paymentAddress, this.currencyName(this.currency));

      if (validateErrorAmount === null && validateErrorAddress === null) {
        this.error = null;
        this.sendPopup = true;

        // this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
          this.timer = setInterval(() => {
            this.countdown--
          }, 1000)
        // });
      } else {
        this.error = validateErrorAmount || validateErrorAddress;
      } 
    },
    onSend() {
      const token = this.smsCodes.map((smsCode, index) =>smsCode[index]).join('');
      this.$store.dispatch('wallet/POST_TRANSFER_CRYPTO', {
        currency: this.$route.params.currency,
        from: this.$route.params.address,
        to: this.paymentAddress,
        amount: this.cryptoCurrencyAmount,
        token
      });
      this.clearData();
    }
  },
  watch: {
    countdown(value) {
      if (value === 0) {
        this.countdown = 59;
        this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams());
      }
    }
  }
}
</script>
