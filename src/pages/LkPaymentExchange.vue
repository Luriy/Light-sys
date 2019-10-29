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
	  					<input type="text" v-model="exchangeAmount" name="" :placeholder="exchangeCurrency.balance">
	  					<span>{{exchangeCurrency.currency}}</span>
	  				</div>

	  				<div class="exchange-amount_input">
	  					<input type="text" name="" :placeholder="`$${exchangeCurrency.balanceUSD}`">
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
                  <span>{{receiveCurrency.balance}} {{receiveCurrency.currency}}</span>
                  <span>${{receiveCurrency.balanceUSD}} USD</span>
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
	  					<input type="text" v-model="receiveAmount" name="" :placeholder="receiveCurrency.balance">
	  					<span>{{receiveCurrency.currency}}</span>
	  				</div>

	  				<div class="exchange-amount_input">
	  					<input type="text" name="" :placeholder="`$${receiveCurrency.balanceUSD}`">
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
						<span>${{exchangeCurrency.balanceUSD}}USD</span>
					</div>
  				</div>
  			</div>
  			<div class="right">
  				<div class="title">You will receive</div>
  				<div class="currency" :class="receiveCurrency.currency.toLowerCase()">
					<div class="text">
						<p>{{receiveAmount.toFixed(8)}} {{receiveCurrency.currency}}</p>
						<span>${{exchangeCurrency.balanceUSD}}USD</span>
					</div>
  					<div class="icon">
  						<img :src="receiveCurrency.icon" alt title>
  					</div>
  				</div>
  			</div>
  		</div>

  		<div class="exchange-block_button">
  			<button @click="exchangePopup = !exchangePopup">Exchange</button>
  			<p class="info">1 {{exchangeCurrency.currency}} = {{transferInfo.rate}} {{receiveCurrency.currency}}</p>
  		</div>

      <lk-pop-up
        v-if="exchangePopup"
        class="exchange-popup"
        @closeModal="closeModal"
      >
        <div slot='title' class="exchange-popup_title">
          <img src="@/assets/images/eth.png" alt title>
          <p class="transaction">Conformation <br> exchange $0.95 USD</p>
          <p class="question">We sent an SMS conformation to the number</p>
          <div class="number-block">
            <p class="number">+7 (952) 219 28 65</p>
            <router-link class="link" to="/">Wrong number?</router-link>
          </div>
        </div>
        <div slot='smsNumber' class="exchange-popup_sms-number">
            <input
              class="number-input"
              @keyup="$event.target.nextElementSibling.focus()"
              placeholder="_"
              type="text"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />
            <input
              class="number-input"
              @keyup="$event.target.nextElementSibling.focus()"
              placeholder="_"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />
            <input
              class="number-input"
              @keyup="$event.target.nextElementSibling.focus()"
              placeholder="_"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />
            <input
              class="number-input"
              @keyup="$event.target.nextElementSibling.focus()"
              placeholder="_"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />
            <input
              class="number-input"
              @keyup="$event.target.nextElementSibling.focus()"
              placeholder="_"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />
            <input
              class="number-input"
              @keyup="send"
              placeholder="_"
              type="text"
              maxLength="1"
              size="1"
              min="0"
              max="9" pattern="[0-9]{1}" />

          <div class="timer-body">
            <div class="title">Resend code:</div>
            <div class="timer">00:59 Sec</div>
          </div>
        </div>
        <div slot='body' class="exchange-popup_body">
          <div class="exchange-popup_info">
            <p class="from">0.000945 BTC</p>
            <img src="@/assets/images/exchange-arrs.svg" alt title>
            <p class="to">0.9454954 ETH</p>
          </div>
          <div class="exchange-block_fee">
            <div class="network-fee">
              <p class="title">Ethereum Network Fee</p>
              <p class="btc-value">0.00021 BTC</p>
              <p>$0.04</p>
            </div>
            <div class="balance">
              <p class="title">Remaining balance</p>
              <p class="btc-value">0 BTC</p>
              <p>$0.00</p>
            </div>
          </div>
        </div>
        <div slot='buttons' class="exchange-popup_buttons">
          <button class="back" @click="exchangePopup = false">Back</button>
        </div>
      </lk-pop-up>
      <lk-pop-up
        v-if="sucessPopup"
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
          <p class="from">0.00956785 BTC</p>
          <div class="images">
            <img src="@/assets/images/btc.png" alt title>
            <img class="success_arrows" src="@/assets/images/exchange-arrs.svg" alt title>
            <img src="@/assets/images/eth.png" alt title>
          </div>
          <p class="to">0.00956785 ETH</p>
          <div class="transaction-info">
            <div class="network-fee">
              <p class="title">Bitcoin Network Fee</p>
              <p>0.00021 BTC</p>
              <p>$0.04</p>
            </div>
            <div class="balance">
              <p class="title">Remaining balance</p>
              <p>0 BTC</p>
              <p>$0.00</p>
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
      search: '',
      exchangePopup: false,
      sucessPopup: false,
  		exchangeBtn: 0,
  		receiveBtn: 0,
  		dir: 0,
      exchangeAmount: 0,
      receiveAmount: 0,
  		exchangeCurrency: {
  			code: 'btc',
        currency: 'BTC',
  			icon: require('@/assets/images/btc.png'),
  			fullName: 'BTC Bitcoin'
  		},
  		receiveCurrency: {
  			code: 'eth',
        currency: 'ETH',
  			icon: require('@/assets/images/eth.png'),
  			fullName: 'ETH Ethereum'
  		}
  	}
  },
  methods: {
    send() {
      this.exchangePopup = false;
      this.sucessPopup = true;
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
      this.sucessPopup = false;
    },
    selectAll() {
      if (this.exchangeCurrency.balance > this.transferInfo.limit) {
        this.exchangeAmount = this.transferInfo.limit;
      } else {
        this.exchangeAmount = this.exchangeCurrency.balance
      }
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeBtn = 1;
    },
    selectHalf() {
      if (this.exchangeCurrency.balance > this.transferInfo.limit) {
        this.exchangeAmount = this.transferInfo.limit / 2;
      } else {
        this.exchangeAmount = this.exchangeCurrency.balance / 2;
      }
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeBtn = 2;
    },
    selectMin() {
      this.exchangeAmount = this.transferInfo.minimum;
      this.receiveAmount = this.exchangeAmount * this.transferInfo.rate;
      this.exchangeBtn = 3;
    }
  },
  computed: {
    wallets() {
      const data = this.$store.getters['wallet/WALLETS'].map((item) => {
        return {
          ...item,
          // todo Здесь хреново немного поскольку валют может быть много на будущее нада сделать функцию в utils которая будет возвращать нужное значение
          fullName: (item.currency === 'BTC') ? 'BTC Bitcoin' : (item.currency === 'ETH') ? 'ETH Ethereum' : item.currency,
          icon: (item.currency === 'BTC') ? require('@/assets/images/btc.png')  : (item.currency === 'ETH') ? require('@/assets/images/eth.png') : item.currency
        }
      }) || [];
      data.push(
          {"address":"3Jbk3LDY23bW3xcRWku921M5xDZVXC1bCj",
            "status":"Active",
            "currency":"BTC",
            "balance":5,
            "balanceUSD":125000,
            "fullName":"BTC Bitcoin",
            "icon":"data:image/png;base64,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"
          },
        {"address":"3Jbk3LDY23bW3xcRWku921M5xDZVXC1bCj",
          "status":"Active",
          "currency":"BTC",
          "balance":0.20,
          "balanceUSD":125000,
          "fullName":"BTC Bitcoin",
          "icon":"data:image/png;base64,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"
        }
        );
      return data
    },
    transferInfo() {
      return this.$store.getters['wallet/TRANSFERINFO']
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
    }
  },
  created() {
    this.getWalletsList();
    this.getTransferInfo();
  },
  watch: {
    wallets() {
      this.setData()
    }
  }
}
</script>
<style>

</style>
