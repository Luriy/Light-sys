<template>
  <lk-layout>
  	<div class="send-block btc">
  		<div class="block-title">
  			<div class="select">
  				Send Bitcoin 
  			</div>
  			<img src="@/assets/images/btc.png" alt title>
  			<router-link to="/wallets" class="close"><img src="@/assets/images/path.svg" alt title></router-link>	
  		</div>
  		<div class="send-form">
  			<div class="send-form-input">
  				<input type="text" v-model="btc" placeholder="Send to Bitcoin address..">
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
				<button>Send</button>
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
export default {
  name: 'LkPaymentSend',
  components: {
    LkLayout
  },
  data() {
  	return {
  		amount: null,
    	btc: null
  	}
  },
    methods: {
    },
}
</script>