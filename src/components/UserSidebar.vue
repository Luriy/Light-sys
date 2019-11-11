<template>
	<div class="sidebar">
		<ul>
			<li><router-link to="/dashboard"><span class="icon dashboard-icon"></span> Dashboard</router-link></li>
			<li><router-link to="/wallets"><span class="icon wallets-icon"></span> Wallets and accounts</router-link></li>
			<li><router-link to="/payments-and-transfer/pay-for"><span class="icon payments-icon"></span> Payments and transfers</router-link></li>
			<li><router-link to="/exchange"><span class="icon exchange-icon"></span> Exchange</router-link></li>
			<li><router-link to="/marketplace"><span class="icon marketplace-icon"></span> Marketplace</router-link></li>
			<li><router-link to="/dapp"><span class="icon dapp-icon"></span> Dapp</router-link></li>
			<li><router-link to="/smartcontract"><span class="icon contract-icon"></span> Smart Contract Designer</router-link></li>
			<li><router-link to="/trading"><span class="icon trading-icon"></span> Trading</router-link></li>
			<li><router-link to="/investment"><span class="icon investment-icon"></span> My investment</router-link></li>
			<li><router-link to="/lending"><span class="icon lending-icon"></span> Lending</router-link></li>
			<li><router-link to="/loyalty"><span class="icon loyalty-icon"></span> Loyalty and cashback</router-link></li>
			<li><router-link to="/workflow"><span class="icon workflow-icon"></span> Workflow</router-link></li>
			<li><router-link to="/settings"><span class="icon settings-icon"></span> Settings</router-link></li>
			<li><router-link to="/help"><span class="icon help-icon"></span> Help</router-link></li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'UserSidebar',
  data() {
  	return {
  	}
  }
}
</script>
