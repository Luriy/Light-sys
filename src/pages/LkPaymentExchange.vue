<template>
  <lk-layout>
  	<div class="exchange-block">
  		<div class="exchange-block_currency">
  			<div class="arrows" v-on:click="toggleCurrency();" v-bind:class="{active: dir}">
  				<img src="@/assets/images/exchange-arrs.svg" alt title>
  			</div>
	  		<div class="left">
	  			<div class="title">Exchange</div>
	  			<div class="select">
	  				<div v-on:click="exchangeModal = !exchangeModal; receiveModal = false;" class="select-title">
	  					<div class="icon"><img :src="exchangeCurrency.icon" alt title></div>
	  					<div class="amount">
	  						<div class="code" v-bind:class="exchangeCurrency.code">{{exchangeCurrency.fullName}}</div>
	  						<div class="value">
	  							<span>0.97750993 BTC</span>
	  							<span>1.63 USD</span>
	  						</div>
	  					</div>
	  					<div class="toggle"></div>
	  				</div>

	  				<div class="select-body" v-if="exchangeModal">
	  					<div class="search-input">
	  						<input type="" name="" placeholder="Search">
	  						<span></span>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/eth.png" alt title></div>
		  					<div class="amount">
		  						<div class="code eth">ETH Etherium</div>
		  						<div class="value">
		  							<span>0.97750993 ETH</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  				</div>
	  			</div>

	  			<div class="trans-size">
	  				<button v-bind:class="{active: exchangeBtn == 1}" v-on:click="exchangeBtn = 1;">ALL</button>
	  				<button v-bind:class="{active: exchangeBtn == 2}" v-on:click="exchangeBtn = 2;">HALF</button>
	  				<button v-bind:class="{active: exchangeBtn == 3}" v-on:click="exchangeBtn = 3;">MIN</button>
	  			</div>

	  			<div class="exchange-amount">
	  				<div class="exchange-amount_input btc">
	  					<input type="text" name="" placeholder="0.97750993">
	  					<span>BTC</span>
	  				</div>

	  				<div class="exchange-amount_input">
	  					<input type="text" name="" placeholder="10,000.00">
	  					<span>USD</span>
	  				</div>
	  			</div>
	  		</div>
	  		<div class="right">
	  			<div class="title">Receive</div>
	  			<div class="select">
	  				<div v-on:click="receiveModal = !receiveModal; exchangeModal = false;" class="select-title">
	  					<div class="icon"><img :src="receiveCurrency.icon" alt title></div>
	  					<div class="amount">
	  						<div class="code" v-bind:class="receiveCurrency.code">{{receiveCurrency.fullName}}</div>
	  						<div class="value">
	  							<span>0.97750993 BTC</span>
	  							<span>1.63 USD</span>
	  						</div>
	  					</div>
	  					<div class="toggle"></div>
	  				</div>

	  				<div class="select-body" v-if="receiveModal">
	  					<div class="search-input">
	  						<input type="" name="" placeholder="Search">
	  						<span></span>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/eth.png" alt title></div>
		  					<div class="amount">
		  						<div class="code eth">ETH Etherium</div>
		  						<div class="value">
		  							<span>0.97750993 ETH</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  					<div class="select-item">
		  					<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
		  					<div class="amount">
		  						<div class="code btc">BTC Bitcoin</div>
		  						<div class="value">
		  							<span>0.97750993 BTC</span>
		  							<span>1.63 USD</span>
		  						</div>
		  					</div>
	  					</div>
	  				</div>
	  			</div>

	  			<div class="trans-size">
	  				<button v-bind:class="{active: receiveBtn == 1}" v-on:click="receiveBtn = 1;">ALL</button>
	  				<button v-bind:class="{active: receiveBtn == 2}" v-on:click="receiveBtn = 2;">HALF</button>
	  				<button v-bind:class="{active: receiveBtn == 3}" v-on:click="receiveBtn = 3;">MIN</button>
	  			</div>

	  			<div class="exchange-amount">
	  				<div class="exchange-amount_input eth">
	  					<input type="text" name="" placeholder="0.97750993">
	  					<span>ETH</span>
	  				</div>

	  				<div class="exchange-amount_input">
	  					<input type="text" name="" placeholder="10,000.00">
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
  				<div class="currency" v-bind:class="exchangeCurrency.code">
  					<div class="icon">
  						<img :src="exchangeCurrency.icon" alt title>
  					</div>
					<div class="text">
						<p>0.97750993 {{exchangeCurrency.code}}</p>
						<span>1.63 USD</span>
					</div>
  				</div>
  			</div>
  			<div class="right">
  				<div class="title">You will receive</div>
  				<div class="currency" v-bind:class="receiveCurrency.code">
					<div class="text">
						<p>0.97750993 {{receiveCurrency.code}}</p>
						<span>1.63 USD</span>
					</div>
  					<div class="icon">
  						<img :src="receiveCurrency.icon" alt title>
  					</div>
  				</div>
  			</div>
  		</div>

  		<div class="exchange-block_button">
  			<button @click="exchangePopup = !exchangePopup">Exchange</button>
  			<p class="info">1 BTC = 52 545454 ETH</p>
  		</div>

      <lk-pop-up v-if="exchangePopup" class="exchange-popup">
        <div slot='title' class="exchange-popup_title">
          <img src="@/assets/images/eth.png" alt title>
          <p class="question">Are you sure you want to</p>
          <p class="transaction">Exchange $0.95USD?</p>
        </div>
        <div slot='body' class="exchange-popup_body">
          <div class="exchange">
            <p class="title">Exchange</p>
            <p class="number">0.134083 ETH</p>
          </div>
          <div class="recipient">
            <p class="title">Recipient</p>
            <p class="number">0.138 BTC</p>
          </div>
          <div class="commission">
            <p class="title">Commission</p>
            <p class="number">0.85 USD</p>
          </div>
        </div>
        <div slot='buttons' class="exchange-popup_buttons">
          <div class="buttons">
            <div class="btn-border-wrapper">
              <button class="btn" @click="exchangePopup = false">Back</button>
            </div>
            <div class="btn-border-wrapper">
              <button class="btn btn-exchange">
                Exchange
              </button>
            </div>
          </div>
        </div>
      </lk-pop-up>
  	</div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout'
import LkPopUp from '@/layout/LkPopUp'
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
      exchangePopup: false,
  		exchangeBtn: 0,
  		receiveBtn: 0,
  		dir: 0,
  		exchangeCurrency: {
  			code: 'btc',
  			icon: require('@/assets/images/btc.png'),
  			fullName: 'BTC Bitcoin'
  		},
  		receiveCurrency: {
  			code: 'eth',
  			icon: require('@/assets/images/eth.png'),
  			fullName: 'ETH Ethereum'
  		}
  	}
  },
    methods: {
    	toggleCurrency: function() {
    		let c = this.exchangeCurrency;
    		this.exchangeCurrency = this.receiveCurrency;
    		this.receiveCurrency = c;
    		this.dir = !this.dir;
    	}
    },
}
</script>
