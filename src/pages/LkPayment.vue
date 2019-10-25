<template>
  <lk-layout>
  	<div class="wallet-block">
  		<div class="block-title">
  			<img src="@/assets/images/eth.png" alt title>
  			<router-link to="/payments" class="close"><img src="@/assets/images/path.svg" alt title></router-link>
  		</div>
  		<div class="wallet-address">
  			<div class="wallet-title">Your Ethereum Address</div>
  			<div class="wallet-address-value" v-on:click="copyToClipboard('#wallet');">
  				<p id="wallet">{{ wallet }}</p>
  				<div class="copy"><span>Copy</span></div>
  			</div>
  			<div class="qr">
  				<img src="@/assets/images/bitmap.png" alt title>
  			</div>
  			<div class="icons">
  				<div class="icon" v-on:click="printWallet();">
  					<span><img src="@/assets/images/print.svg" alt title></span>
  					<p>Print This Address</p>
  				</div>
  				<div class="icon" v-on:click="sendEmail();">
  					<span><img src="@/assets/images/envelope.svg" alt title></span>
  					<p>Email This Address</p>
  				</div>
  				<div class="icon">
  					<span><img src="@/assets/images/link.svg" alt title></span>
  					<p>View On Blockchain</p>
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
  		wallet: 'Ox43289423fsdfs432894239'
  	}
  },
    methods: {
    	sendEmail() {
    		window.open('mailto:?subject=LightNet Ethereum Address&body=My LightNet Ethereum address is: '+this.wallet);
    	},
    	printWallet() {
    		var win = window.open();
	        win.document.write(this.wallet);
	        win.print();
	        win.close()
    	},
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
		    	elem.textContent = 'Copied to clipboard';
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