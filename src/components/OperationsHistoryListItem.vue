<template>
	<div>
		<div class="title">
			<span>{{ formatDate(operation.date) }}</span>
		</div>
		<div
			v-for="(transaction, index) in operation.transactions"
			:key="transaction.url + index"
			:class="{
				'operations-history-list-item': true,
				'plus-trans': transaction.source.To === transaction.currentWallet.toLowerCase(),
			}"
		>
			<div class="left">
				<div class="type">
					<img
						v-if="transaction.source.From === transaction.source.To"
						src="@/assets/images/transaction-exchange.svg"
					/>
					<img
						v-else-if="transaction.source.From === transaction.currentWallet.toLowerCase()"
						src="@/assets/images/transaction-sent.svg"
					/>
					<img
						v-else-if="transaction.source.To === transaction.currentWallet.toLowerCase()"
						src="@/assets/images/transaction-received.svg"
					/>
				</div>
				<div class="status">
					<p v-if="transaction.source.From === transaction.source.To">Exchanged</p>
					<p v-else-if="transaction.source.From === transaction.currentWallet.toLowerCase()">
						Sent
					</p>
					<p v-else-if="transaction.source.To === transaction.currentWallet.toLowerCase()">
						Received
					</p>
					<span>{{ transaction.source.Time.slice(-5) }}</span>
				</div>
			</div>
			<div class="code">
				<template v-if="transaction.currency === 'BTC'">
					<img src="@/assets/images/btc.png" alt title />
					<span class="btc">Bitcoin</span>
				</template>
				<template v-if="transaction.currency === 'ETH'">
					<img src="@/assets/images/eth.png" alt title />
					<span class="eth">Ethereum</span>
				</template>
				<template v-if="transaction.currency === 'LTC'">
					<img src="@/assets/images/ltc.svg" alt title />
					<span class="eth">Litecoin</span>
				</template>
				<template v-if="transaction.currency === 'NEO Bank'">
					<img src="@/assets/images/lightnet.png" alt title />
					<span class="eth">NEO Bank</span>
				</template>
			</div>
			<div class="address" v-if="!transaction.source.To && !transaction.source.From">
				{{ transaction.source.address }}
			</div>
			<div
				class="address"
				v-else-if="!(transaction.source.To === transaction.currentWallet.toLowerCase())"
			>
				{{ transaction.source.From }}
			</div>
			<div
				class="address"
				v-else-if="!(transaction.source.From === transaction.currentWallet.toLowerCase())"
			>
				{{ transaction.source.To }}
			</div>
			<div class="amount">
				<p>{{ formatCurrency(transaction.value, '', 5) }} {{ transaction.currency }}</p>
				<span>{{ formatCurrency(transaction.valueUSD, '$') }} USD</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['operation'],
	filters: {
		// formatAMPM: (date) => {
		// 	var hours = date.getHours();
		// 	var minutes = date.getMinutes();
		// 	var ampm = hours >= 12 ? 'PM' : 'AM';
		// 	hours = hours % 12;
		// 	hours = hours ? hours : 12; // the hour '0' should be '12'
		// 	minutes = minutes < 10 ? '0' + minutes : minutes;
		// 	var strTime = hours + ':' + minutes + ' ' + ampm;
		// 	return strTime;
		// },
	},
	computed: {
		isReceived() {
			return this.operation.value >= 0;
		},
	},
	methods: {
		formatDate(date) {
			const stringDate = date.toString();
			const day = stringDate.slice(8, 10);
			const month = stringDate.slice(4, 7);
			const year = date.getFullYear();
			return `${month} ${day}, ${year}`;
		},
	},
};
</script>
