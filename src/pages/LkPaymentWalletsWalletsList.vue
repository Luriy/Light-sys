<template>
  <lk-layout>
  	<button class="add-token">
  		Add token
  	</button>
 	<div class="crypto-wallets">
 		<div class="title">
 			<p>Wallets</p>
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
 				<tr>
 					<td>
 						<div class="currency">
 							<div class="icon"><img src="@/assets/images/btc.png" alt title></div>
 							<div class="text btc">
 								<p>Bitcoin</p>
 								<span>BTC</span>
 							</div>
 						</div>
 					</td>
 					<td>
 						$10,298.02
 					</td>
 					<td>-1.94%</td>
 					<td><div class="progress"><img src="@/assets/images/graph-yellow.svg" alt title></div></td>
 				</tr>
 				<tr>
 					<td>
 						<div class="currency">
 							<div class="icon"><img src="@/assets/images/eth.png" alt title></div>
 							<div class="text eth">
 								<p>Ethereum</p>
 								<span>ETH</span>
 							</div>
 						</div>
 					</td>
 					<td>
 						$3.17
 					</td>
 					<td>-2.05%</td>
 					<td><div class="progress"><img src="@/assets/images/graph-blue.svg" alt title></div></td>
 				</tr>
 				<tr>
 					<td>
 						<div class="currency">
 							<div class="icon"><img src="@/assets/images/etc.png" alt title></div>
 							<div class="text etc">
 								<p>Ethereum Classic</p>
 								<span>ETC</span>
 							</div>
 						</div>
 					</td>
 					<td>
 						$3.17
 					</td>
 					<td>-2.05%</td>
 					<td><div class="progress"><img src="@/assets/images/graph-green.svg" alt title></div></td>
 				</tr>
 			</tbody>
 		</table>
 	</div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
export default {
  name: 'LkPaymentWalletsWalletsList',
  components: {
    LkLayout
  },
  data() {
  	return {

  	}
  },
    methods: {
    },
}
</script>