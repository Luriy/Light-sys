<template>
	<div>
		<div class="tabs-bar">
			<button
				class="tab"
				v-for="link in links"
				:to="link.to"
				:key="link.name"
				:class="{ active: $router.history.current.path.includes(link.activeString) }"
				@click="handleClickTab(link.name, link.to)"
			>
				{{ link.name }}
			</button>
		</div>
		<slot></slot>
	</div>
</template>
<style scoped>
.tabs-bar {
	display: flex;
	margin-bottom: 25px;
}
.tab {
	padding: 10px 15px;
	margin-right: 10px;
	color: #fff;
	font-weight: 600;
	text-decoration: none;
	border-radius: 8px;
	font-size: 16px;
}
.tab:last-of-type {
	margin-right: 0;
}
.tab.active {
	background-color: #513685;
}
</style>
<script>
export default {
	name: 'LkPaymentsAndTransfers',
	data() {
		return {
			links: [
				{
					name: 'Transfer',
					to: '/payments-and-transfer/send/BTC/none',
					activeString: '/payments-and-transfer/send',
				},
				{
					name: 'Pay for',
					to: '/payments-and-transfer/pay-for',
					activeString: '/payments-and-transfer/pay-for',
				},
			],
		};
	},
	methods: {
		handleClickTab(name, route) {
			this.activeTab = name;
			this.$router.push(route);
		},
	},
};
</script>
