<template>
  <lk-layout>
  	<div class="wallet-send-block">
  		<div class="wallet-send-currency">
  			<img src="@/assets/images/eth.png" alt title>  			
  		</div>
  		<div class="wallet-send-amount">
  			<p class="wallet-send-amount--crypto">25.97750993 <span>ETH</span></p>
  			<p class="wallet-send-amount--fiat">$4,687.38 <span>USD</span></p>
  		</div>
  		<div class="buttons">
  			<div class="btn-border-wrapper">
  				<router-link to="/payments/send/eth"><button class="btn">Send</button></router-link>  				
  			</div>
  			<div class="btn-border-wrapper">
  				<router-link to="/payments/address"><button class="btn">Receive</button></router-link>		
  			</div>
  			<div class="btn-border-wrapper btn-exchange">
  				<router-link to="/exchange"><button class="btn"><img src="@/assets/images/exchange.svg" alt title></button></router-link>	
  			</div>
  		</div>
  	</div>

  	<div class="wallet-description">
  		<div class="title">Description</div>
  		<div class="text">
  			Ethereum is a decentralized computing platform that runs smart contracts, which are contracts thah execute withou human intervention. 
			ETH popularized the idea programmable transactions instead of only for money transfers. The platform is user for crowdfuundin (ICOs) , 
			the cretion of new digital assets, and more. 
  		</div>	
  		<ul>
  			<li></li>
  		</ul>
  	</div>
  	
  	<div class="trans-list">
  		<div class="trans-date">Oct 17, 2018</div>
  		<div class="trans-item" v-for="item in trans" v-bind:class="{active: item.isactive}">
  			<div class="trans-card">  				
	  			<div class="trans-top">
	  				<button class="btn">
	  					<span class="icon"><img src="@/assets/images/path2.svg" alt title></span>
	  					<div class="text">
	  						<p>Sent</p>
	  						<span>16:09 PM</span>
	  					</div>
	  				</button>
	  				<div class="code">
	  					<img src="@/assets/images/eth.png" alt title>
	  					<span class="eth">Ethereum</span>
	  				</div>	
	  				<div class="address">
	  					cl4948239fsd0fsdjkfdfsdfjskfsd
	  				</div>
	  				<div class="trans-amount" v-on:click="item.isactive = !item.isactive">
	  					<span class="text">{{item.crypto}} ETH</span>
	  					<span class="icon"></span>
	  				</div>
	  			</div>
	  			<div class="trans-info">
	  				<table>
	  					<thead>
	  						<tr>
	  							<th>
	  								<p>Date</p>
	  								<span>{{item.datetime}}</span>
	  							</th>
	  							<th>
	  								<p>Transaction ID</p>
	  								<span><a href="#">{{item.id}}</a></span>
	  							</th>
	  							<th>
	  								<p>Fee</p>
	  								<span>{{item.fee}}</span>
	  							</th>
	  							<th>
	  								<p>To</p>
	  								<span>{{item.to}}</span>
	  							</th>
	  						</tr>
	  					</thead>
	  					<tbody>
	  						<tr>
	  							<td>
	  								<p>Now</p>
	  								<span>{{item.now}}</span>
	  							</td>
	  							<td colspan="3">
	  								<p>Feb 6th</p>
	  								<span>{{item.prev}}}</span>
	  							</td>
	  						</tr>
	  					</tbody>
	  				</table>
	  			</div>
  			</div>
  		</div>
  	</div>
  </lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
export default {
  name: 'LkPayment',
  components: {
    LkLayout
  },
  data() {
  	return {
  		trans: [
  			{
  				date: 'Feb 06, 2019',
  				datetime: '02/06/2019 12:00 AM',
  				crypto: '0.037002550726035',
  				id: '0x29ecfj54fdjskjfddcc4354',
  				fee: '0.00024516 ETH',
  				to: 'ox24378efdjsfks54892fdkcf…',
  				now: '$6.96 USD',
  				prev: '$2.96 USD',
  				isactive: false
  			},
  			{
  				date: 'Feb 06, 2019',
  				datetime: '02/06/2019 12:00 AM',
  				crypto: '0.037002550726035',
  				id: '0x29ecfj54fdjskjfddcc4354',
  				fee: '0.00024516 ETH',
  				to: 'ox24378efdjsfks54892fdkcf…',
  				now: '$6.96 USD',
  				prev: '$2.96 USD',
  				isactive: false
  			},
  			{
  				date: 'Feb 06, 2019',
  				datetime: '02/06/2019 12:00 AM',
  				crypto: '0.037002550726035',
  				id: '0x29ecfj54fdjskjfddcc4354',
  				fee: '0.00024516 ETH',
  				to: 'ox24378efdjsfks54892fdkcf…',
  				now: '$6.96 USD',
  				prev: '$2.96 USD',
  				isactive: false
  			},
  			{
  				date: 'Feb 06, 2019',
  				datetime: '02/06/2019 12:00 AM',
  				crypto: '0.037002550726035',
  				id: '0x29ecfj54fdjskjfddcc4354',
  				fee: '0.00024516 ETH',
  				to: 'ox24378efdjsfks54892fdkcf…',
  				now: '$6.96 USD',
  				prev: '$2.96 USD',
  				isactive: false
  			},
  		]
  	}
  },
    methods: {
    	copyToClipboard() {
    		var elem = document.getElementById("wallet");
		    var targetId = "_hiddenCopyText_";
		    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
		    var origSelectionStart, origSelectionEnd;
		    if (isInput) {
		        target = elem;
		        origSelectionStart = elem.selectionStart;
		        origSelectionEnd = elem.selectionEnd;
		    } else {
		        target = document.getElementById(targetId);
		        if (!target) {
		            var target = document.createElement("textarea");
		            target.style.position = "absolute";
		            target.style.left = "-9999px";
		            target.style.top = "0";
		            target.id = targetId;
		            document.body.appendChild(target);
		        }
		        target.textContent = elem.textContent;
		    }
		    var currentFocus = document.activeElement;
		    target.focus();
		    target.setSelectionRange(0, target.value.length);
		    
		    var succeed;
		    try {
		    	succeed = document.execCommand("copy");
		    	this.wallet = 'Copied to clipboard';
		    } catch(e) {
		        succeed = false;
		    }
		    if (currentFocus && typeof currentFocus.focus === "function") {
		        currentFocus.focus();
		    }
		    
		    if (isInput) {
		        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
		    } else {
		        target.textContent = "";
		    }
		    return succeed;
		}
    },
}
</script>