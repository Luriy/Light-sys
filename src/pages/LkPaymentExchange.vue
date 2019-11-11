<template>
  <lk-layout>
  	<div class="exchange-block">
  		<div class="exchange-block_currency">
  			<div class="arrows" @click="toggleCurrency();" v-bind:class="{active: dir}">
  				<img src="@/assets/images/exchange-arrs.svg" alt title>
  			</div>
	  		<div class="left">
	  			<div class="title">Exchange</div>
	  			<div class="select">
	  				<div @click="exchangeAction" class="select-title">
	  					<div class="icon"><img :src="exchangeCurrency.icon" alt title></div>
	  					<div class="amount">
	  						<div class="code" :class="exchangeCurrency.code">{{exchangeCurrency.fullName}}</div>
	  						<div class="value">
	  							<span>{{exchangeCurrency.balance}} {{exchangeCurrency.currency}}</span>
	  							<span>${{exchangeCurrency.balanceUSD}} USD</span>
	  						</div>
	  					</div>
	  					<div class="toggle"></div>
	  				</div>

	  				<div class="select-body" v-if="exchangeModal">
              <div class="select-wrapper">
                <div class="search-input">
                  <input type="text" v-model="search" name="" placeholder="Search">
                  <span></span>
                </div>
                <div
                  class="select-item"
                  v-for="(wallet, index) of filteredExchangeWallets"
                  :key="index"
                  @click="selectExchangeWallet(wallet)"
                >
                  <div class="icon"><img :src="wallet.icon" alt></div>
                  <div class="amount">
                    <div class="code btc">{{wallet.fullName}}</div>
                    <div class="value">
                      <span>{{wallet.balance}} {{wallet.currency}}</span>
                      <span>${{wallet.balanceUSD}}</span>
                    </div>
                  </div>
                </div>
              </div>
	  				</div>
	  			</div>

	  			<div class="trans-size">
	  				<button :class="{active: exchangeBtn == 1}" @click="selectAll">ALL</button>
	  				<button :class="{active: exchangeBtn == 2}" @click="selectHalf">HALF</button>
	  				<button :class="{active: exchangeBtn == 3}" @click="selectMin">MIN</button>
	  			</div>

	  			<div class="exchange-amount">
	  				<div class="exchange-amount_input" :class="exchangeCurrency.currency.toLowerCase()">
              <v-text-field
                v-model="exchangeAmount"
                @input="exchangeChange"
                placeholder="0"
                required
              ></v-text-field>
	  					<span>{{exchangeCurrency.currency}}</span>
	  				</div>

	  				<div class="exchange-amount_input">
              <v-text-field
                v-model="exchangeUSD"
                class="dollars_input"
                solo
                prepend-inner-icon="$"
                placeholder="0"
              ></v-text-field>
	  					<span>USD</span>
	  				</div>
	  			</div>
	  		</div>
	  		<div class="right">
	  			<div class="title">Receive</div>
	  			<div class="select">
	  				<div @click="receiveAction" class="select-title">
	  					<div class="icon"><img :src="receiveCurrency.icon" alt title></div>
	  					<div class="amount">
	  						<div class="code" :class="receiveCurrency.code">{{receiveCurrency.fullName}}</div>
	  						<div class="value">
                  <span>1 {{exchangeCurrency.currency}} =</span>
                  <span>{{transferInfo.rate}} {{receiveCurrency.currency}}</span>
	  						</div>
	  					</div>
	  					<div class="toggle"></div>
	  				</div>

	  				<div class="select-body" v-if="receiveModal">
              <div class="select-wrapper">
                <div class="search-input">
                  <input type="" name="" v-model="search" placeholder="Search">
                  <span></span>
                </div>
                <div
                  class="select-item"
                  v-for="(wallet, index) of filteredReceiveWallets"
                  :key="index"
                  @click="selectReceiveWallet(wallet)"
                >
                  <div class="icon"><img :src="wallet.icon" alt title></div>
                  <div class="amount">
                    <div class="code btc">{{wallet.fullName}}</div>
                    <div class="value">
                      <span>{{wallet.balance}} {{wallet.currency}}</span>
                      <span>${{wallet.balanceUSD}}</span>
                    </div>
                  </div>
                </div>
              </div>
	  				</div>
	  			</div>

	  			<div class="exchange-amount">
	  				<div class="exchange-amount_input" :class="receiveCurrency.currency.toLowerCase()">
              <v-text-field
                v-model="receiveAmount"
                placeholder="0"
                required
              ></v-text-field>
	  					<span>{{receiveCurrency.currency}}</span>
	  				</div>

	  				<div class="exchange-amount_input">
              <v-text-field
                v-model="exchangeUSD"
                class="dollars_input"
                solo
                prepend-inner-icon="$"
                placeholder="0"
              ></v-text-field>
	  					<span>USD</span>
	  				</div>
	  			</div>
	  		</div>
  		</div>

  		<div class="exchange-block_info">
  			<div class="to">
  				<img src="@/assets/images/right-arr-white.svg" alt title>
  			</div>
  			<div class="left">
  				<div class="title">You are exchanging</div>
  				<div class="currency" :class="exchangeCurrency.currency.toLowerCase()">
  					<div class="icon">
  						<img :src="exchangeCurrency.icon" alt title>
  					</div>
					<div class="text">
						<p>{{exchangeAmount}} {{exchangeCurrency.currency}}</p>
						<span>${{exchangeUSD.toFixed(5)}}USD</span>
					</div>
  				</div>
  			</div>
  			<div class="right">
  				<div class="title">You will receive</div>
  				<div class="currency" :class="receiveCurrency.currency.toLowerCase()">
					<div class="text">
						<p>{{receiveAmount.toFixed(5)}} {{receiveCurrency.currency}}</p>
						<span>${{receiveUSD.toFixed(5)}}USD</span>
					</div>
  					<div class="icon">
  						<img :src="receiveCurrency.icon" alt title>
  					</div>
  				</div>
  			</div>
  		</div>

  		<div class="exchange-block_button">
  			<button @click="exchange">Exchange</button>
  			<p class="info">1 {{exchangeCurrency.currency}} = {{transferInfo.rate}} {{receiveCurrency.currency}}</p>
  		</div>

      <lk-pop-up
        v-if="exchangePopup"
        class="exchange-popup"
        @closeModal="closeModal"
      >
        <div slot='title' class="exchange-popup_title">
          <img :src="exchangeCurrency.icon" alt title>
          <p class="transaction">Confirmation <br> exchange {{exchangeUSD.toFixed(3)}} USD</p>
          <div class="phone-question" v-if="user.Phone">
            <p class="question">We sent an SMS conformation to the number</p>
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
            @keyup="index !== (smsCodes.length - 1) ? $event.target.nextElementSibling.focus() : send()"
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
            <p class="from">{{exchangeAmount}} {{exchangeCurrency.currency}}</p>
            <img src="@/assets/images/exchange-arrs.svg" alt title>
            <p class="to">{{receiveAmount.toFixed(5)}} {{receiveCurrency.currency}}</p>
          </div>
          <div class="exchange-block_fee">
            <div class="network-fee">
              <p class="title"><span>{{exchangeCurrency.name}}</span> Network Fee</p>
              <p class="btc-value">{{types[exchangeCurrency.name].minerFee}} {{exchangeCurrency.currency}}</p>
              <p>${{(types[exchangeCurrency.name].price * transferInfo.minerFee).toFixed(3)}}</p>
            </div>
            <div class="balance">
              <p class="title">Remaining balance</p>
              <p class="btc-value">{{exchangeCurrency.balance}} {{exchangeCurrency.currency}}</p>
              <p>${{exchangeCurrency.balanceUSD}}</p>
            </div>
          </div>
        </div>
        <div slot='buttons' class="exchange-popup_buttons">
          <button class="back" @click="exchangePopup = false">Back</button>
        </div>
      </lk-pop-up>
      <lk-pop-up
        v-if="exchangeSucces"
        class="exchange-popup"
        :popup-size="{width: '346px', height: '387px'}"
        @closeModal="closeModal"
      >
        <div slot='title' class="success-popup_title">
          <div class="icon-wrapper">
            <i class="icon checked-icon">Success icon</i>
          </div>
          <p class="status">Success</p>
        </div>
        <div slot='body' class="success-popup_body">
          <p class="from">{{exchangeAmount}} {{exchangeCurrency.currency}}</p>
          <div class="images">
            <img :src="exchangeCurrency.icon" alt title>
            <img class="success_arrows" src="@/assets/images/exchange-arrs.svg" alt title>
            <img :src="receiveCurrency.icon" alt title>
          </div>
          <p class="to">{{receiveAmount}} {{receiveCurrency.currency}}</p>
          <div class="transaction-info">
            <div class="network-fee">
              <p class="title">Bitcoin Network Fee</p>
              <p class="middle-text">0.00021 BTC</p>
              <p>$0.04</p>
            </div>
            <div class="balance">
              <p class="title">Remaining balance</p>
              <p class="middle-text">{{exchangeCurrency.balance ? exchangeCurrency.balance.toFixed(3) : 0}} {{exchangeCurrency.currency}} </p>
              <p> ${{exchangeCurrency.balanceUSD.toFixed(3)}} </p>
            </div>
          </div>
        </div>
      </lk-pop-up>
  	</div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout'
import LkPopUp from '@/layout/LkPopUp';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
import currencyList from '@/settings/currensyList'
import { getAuthParams } from '@/functions/auth';

export default {
  name: 'LkPaymentExchange',
  components: {
    LkLayout,
    LkPopUp
  },
  data () {
  	return {
      receiveModal: false,
      exchangeModal: false,
      countdown: 59,
      timer: null,
      search: '',
      smsCodes: [
        {0: ''},
        {1: ''},
        {2: ''},
        {3: ''},
        {4: ''},
        {5: ''},
      ],
      errorMessages: '',
      formHasErrors: false,
      exchangePopup: false,
  		exchangeBtn: 0,
  		receiveBtn: 0,
  		dir: 0,
      exchangeAmount: 0,
      receiveAmount: 0,
      exchangeUSD: 0,
      receiveUSD: 0,
  		exchangeCurrency: {
  			code: 'btc',
        currency: 'BTC',
        balance: 0,
        balanceUSD: 0,
        ...currencyList['BTC']
  		},
  		receiveCurrency: {
  			code: 'eth',
        currency: 'ETH',
        balance: 0,
        balanceUSD: 0,
        ...currencyList['ETH']
  		}
  	}
  },
  methods: {
    send() {
      this.exchangePopup = false;
      const token = this.smsCodes.map((smsCode, index) =>smsCode[index]).join('');
      this.$store.dispatch('wallet/POST_TRANSFER', {
        transferData: {
          From: this.exchangeCurrency.address,
          To: this.receiveCurrency.address,
          Amount: this.exchangeAmount,
          Token: token,
          ...getAuthParams()
        },
        pair: {
          exchange: capitalizeFirstLetter(this.exchangeCurrency.currency.toLowerCase()),
          receive: capitalizeFirstLetter(this.receiveCurrency.currency.toLowerCase())
        }
      }).then(() => {
        this.smsCodes.forEach((smsCode, index) =>smsCode[index] = '')
      });
    },
    exchange() {
      this.exchangePopup = !this.exchangePopup;
      this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
        this.timer = setInterval(() => {
          this.countdown--
        }, 1000)
      });
    },
    setData() {
      if (this.wallets && this.wallets.length) {
        this.exchangeCurrency = this.wallets.filter(({currency}) => currency === 'BTC')[0];
        this.receiveCurrency = this.wallets.filter(({currency}) => currency === 'ETH')[0];
      }
    },
    exchangeAction() {
      this.exchangeModal = !this.exchangeModal;
      this.receiveModal = false;
      this.search = '';
    },
    receiveAction() {
      this.receiveModal = !this.receiveModal;
      this.exchangeModal = false;
      this.search = '';
    },
    toggleCurrency: function() {
      this.receiveAmount = 0;
      this.exchangeAmount = 0;
      this.exchangeUSD = 0;
      this.receiveUSD = 0;
      let c = this.exchangeCurrency;
      this.exchangeCurrency = this.receiveCurrency;
      this.receiveCurrency = c;
      this.dir = !this.dir;
      this.getTransferInfo();
    },
    getWalletsList() {
      this.$store.dispatch('wallet/GET_WALLETS');
    },
    getTransferInfo() {
      this.$store.dispatch('wallet/GET_TRANSFER_INFO', {
        exchange: capitalizeFirstLetter(this.exchangeCurrency.currency.toLowerCase()),
        receive: capitalizeFirstLetter(this.receiveCurrency.currency.toLowerCase())
      });
    },
    getTypes() {
      this.$store.dispatch('wallet/GET_TYPES');
    },
    selectExchangeWallet(wallet) {
      this.exchangeCurrency = wallet;
      this.exchangeModal = false;
      this.getTransferInfo();
    },
    selectReceiveWallet(wallet) {
      this.receiveCurrency = wallet;
      this.receiveModal = false;
    },
    closeModal() {
      this.exchangePopup = false;
      if (this.exchangeSucces) {
        this.$store.dispatch('wallet/SET_SUCCES', false);
      }
    },
    selectAll() {
      if (this.exchangeCurrency.balance > this.transferInfo.limit) {
        this.exchangeAmount = this.transferInfo.limit;
      } else {
        this.exchangeAmount = this.exchangeCurrency.balance
      }
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeChange(this.exchangeAmount);
      this.receiveChange(this.receiveAmount);
      this.exchangeBtn = 1;
    },
    selectHalf() {
      if (this.exchangeCurrency.balance > this.transferInfo.limit) {
        this.exchangeAmount = this.transferInfo.limit / 2;
      } else {
        this.exchangeAmount = this.exchangeCurrency.balance / 2;
      }
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeChange(this.exchangeAmount);
      this.receiveChange(this.receiveAmount);
      this.exchangeBtn = 2;
    },
    selectMin() {
      this.exchangeAmount = this.transferInfo.minimum;
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeChange(this.exchangeAmount);
      this.receiveChange(this.receiveAmount);
      this.exchangeBtn = 3;
    },
    exchangeChange() {
      const price = this.types[this.exchangeCurrency.name].price;
      this.exchangeUSD = this.exchangeAmount * price;
    },
    receiveChange(value) {
      const price = this.types[this.receiveCurrency.name].price;
      this.receiveUSD = value * price;
    }
  },
  computed: {
    wallets() {
      const data = this.$store.getters['wallet/WALLETS'].map((item) => {
        return {
          ...item,
          ...currencyList[item.currency]
        }
      }) || [];
      data.push(
        {
          code: 'btc',
          currency: 'BTC',
          address: '3PQhzGATmPfBcswJCxj4QqSipDMiEsnNih',
          balance: 10,
          balanceUSD: 1055550,
          ...currencyList['BTC']
        },
        {
          code: 'eth',
          currency: 'ETH',
          address: '3Jbk3LDY23bW3xcRWku921M5xDZVXC1bCj',
          balance: 150,
          balanceUSD: 1055,
          ...currencyList['ETH']
        },
      );
      return data
    },
    user() {
      return {...getAuthParams()}
    },
    transferInfo() {
      return this.$store.getters['wallet/TRANSFER_INFO']
    },
    types() {
      return this.$store.getters['wallet/TYPES']
    },
    filteredExchangeWallets() {
      return this.wallets
        .filter(({currency})=> currency !== this.receiveCurrency.currency)
        .filter(({fullName}) => (fullName.toLowerCase().includes(this.search)))
    },
    filteredReceiveWallets() {
      return this.wallets
        .filter(({currency})=> currency !== this.exchangeCurrency.currency)
        .filter(({fullName}) => (fullName.toLowerCase().includes(this.search)))
    },
    exchangeSucces() {
      return this.$store.getters['wallet/EXCHANGE_SUCCES'];
    }
  },
  created() {
    this.getWalletsList();
    this.getTransferInfo();
    this.getTypes();
  },
  watch: {
    wallets() {
      this.setData()
    },
    countdown(value) {
      if (value === 0) {
        this.countdown = 59;
        this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams());
      }
    },
    exchangePopup(status) {
      if (!status) {
        clearInterval(this.timer);
        this.countdown = 59;
      }
    }
  }
}
</script>
<style>

</style>
