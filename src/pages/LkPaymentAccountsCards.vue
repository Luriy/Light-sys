<template>
  <lk-layout>
 	<div class="accounts-list">
 		<div class="title">
 			<p>Accounts and Cards</p>
 			<router-link to="/wallets"><div class="close"><img src="@/assets/images/path.svg" alt title></div></router-link>
 		</div>
 		<div class="accounts-list_wrapper">
 			<div class="accounts-list_wrapper_title">
 				Accounts and Cards
 			</div>
 			<div class="accounts-list_wrapper_tabs">
 				<div class="accounts-list_wrapper_tab" v-bind:class="{active: tab1.isActive}">
 					<div class="accounts-list_wrapper_tab_header" v-on:click="tab1.isActive = !tab1.isActive">
 						<div class="icon">
 							<div class="image"><img src="@/assets/images/wallet.svg" alt title></div>
 							<p>Open an account</p>
 						</div>
 						<div class="toggle"></div>
 					</div>

 					<div class="accounts-list_wrapper_tab_body">
 						<div class="accounts-list_wrapper_tab_body_title">
 							In what currency do I open an account?
 						</div>
 						<div class="accounts-list_wrapper_tab_body_table">
 							<div class="accounts-list_wrapper_tab_body_table_tr" v-on:click="setActive(item, tab1.tableData)" v-for="item in tab1.tableData">
 								<div class="currency">
 									<div class="icon">{{item.code}}</div>
 									<div class="text">{{item.full}}</div>
 								</div>
 								<div class="right">
 									<button v-if="item.isActive">Apply</button>
 									<div class="checkbox" v-bind:class="{active: item.isActive}"></div>	 									
 								</div>
 							</div>
 						</div>
 					</div>
 				</div>

 				<div class="accounts-list_wrapper_tab" v-bind:class="{active: tab2.isActive}">
 					<div class="accounts-list_wrapper_tab_header" v-on:click="tab2.isActive = !tab2.isActive">
 						<div class="icon">
 							<div class="image"><img src="@/assets/images/credit-card.svg" alt title></div>
 							<p>Open a card</p>
 						</div>
 						<div class="toggle"></div>
 					</div>

 					<div class="accounts-list_wrapper_tab_body">
 						<div class="accounts-list_wrapper_tab_body_title">
 							What type of card do you want to open?
 						</div>
 						<div class="accounts-list_wrapper_tab_body_table">
 							<div class="accounts-list_wrapper_tab_body_table_tr" v-on:click="setActive(item, tab2.tableData)" v-for="item in tab2.tableData">
 								<div class="currency">
 									<div class="icon">{{item.code}}</div>
 									<div class="text">{{item.full}}</div>
 								</div>
 								<div class="right">
 									<div class="type" v-if="item.isActive">
 										<div class="checkbox-type" v-on:click="item.type = 1" v-bind:class="{active: item.type == 1}">
 											<div></div>
 											<span>Physical</span>
 										</div>
 										<div class="checkbox-type" v-on:click="item.type = 2" v-bind:class="{active: item.type == 2}">
 											<div></div>
 											<span>Virtual</span>
 										</div>
 									</div>
 									<div class="checkbox" v-bind:class="{active: item.isActive}"></div>	 									
 								</div>
 							</div>
 						</div>
 					</div>
 				</div>

 				<div class="accounts-list_wrapper_tab" v-bind:class="{active: tab3.isActive}">
 					<div class="accounts-list_wrapper_tab_header" v-on:click="tab3.isActive = !tab3.isActive">
 						<div class="icon">
 							<div class="image"><img src="@/assets/images/wallet2.svg" alt title></div>
 							<p>Deposits</p>
 						</div>
 						<div class="toggle"></div>
 					</div>

 					<div class="accounts-list_wrapper_tab_body">
 						<div class="accounts-list_wrapper_tab_body_title">
 							Deposit Options
 						</div>
 						<div class="accounts-list_wrapper_tab_body_deposit">
 							<div class="column">
 								<div class="title">Choose currency</div>
 								<div class="choose-input">
 									<div class="text">Choose currency</div>
 								</div>
 							</div>
 							<div class="column">
 								<div class="title">For a period</div>
 								<div class="range-slider">
 									<div class="value">{{sliderValue}} mounth</div>
 									<range-slider
									    class="slider"
									    min="1"
									    max="24"
									    step="1"
									    v-model="sliderValue">
									</range-slider>
 								</div>
 							</div>
 							<div class="row">
 								<div class="title">
 									Select an account
 								</div>
 								<div class="choose-input">
 									<div class="text">Choose</div>
 								</div>
 							</div>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 	</div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
export default {
  name: 'LkPaymentWalletsWalletsList',
  components: {
    LkLayout,
    RangeSlider
  },
  data() {
  	return {
  		sliderValue: null,
  		tab1: {
  			isActive: false,
  			tableData: [
  				{
  					code: '₽',
  					full: 'Russian Ruble',
  					isActive: false
  				},
  				{
  					code: '円',
  					full: 'Japanese yen',
  					isActive: false
  				},
  				{
  					code: '$',
  					full: 'U.S. dollar',
  					isActive: false
  				},
  				{
  					code: '€',
  					full: 'European Euro',
  					isActive: false
  				},
  			]
  		},
  		tab2: {
  			isActive: false,
  			tableData: [
  				{
  					code: '₽',
  					full: 'Russian Ruble',
  					isActive: false,
  					type:0
  				},
  				{
  					code: '円',
  					full: 'Japanese yen',
  					isActive: false,
  					type:0
  				},
  				{
  					code: '$',
  					full: 'U.S. dollar',
  					isActive: false,
  					type:0
  				},
  				{
  					code: '€',
  					full: 'European Euro',
  					isActive: false,
  					type:0
  				},
  			]
  		},
  		tab3: {
  			isActive: false
  		}
  	}
  },
    methods: {
    	setActive: function(e, a) {
    		a.forEach(function(c) {
    			if(c!=e) {
    				c.isActive = false;
    			} else {
    				c.isActive = true;
    			}
    		})
    	}
    },
}
</script>