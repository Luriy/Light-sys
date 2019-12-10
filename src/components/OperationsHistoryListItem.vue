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
				'plus-trans': getTransactionType(transaction) === 'receive',
			}"
		>
			<div class="left">
				<div class="type">
					<img
						v-if="getTransactionType(transaction) === 'exchange'"
						src="@/assets/images/transaction-exchange.svg"
					/>
					<img
						v-else-if="getTransactionType(transaction) === 'send'"
						src="@/assets/images/transaction-sent.svg"
					/>
					<img
						v-else-if="getTransactionType(transaction) === 'receive'"
						src="@/assets/images/transaction-received.svg"
					/>
				</div>
				<div class="status">
					<p v-if="getTransactionType(transaction) === 'exchange'">Exchanged</p>
					<p v-else-if="getTransactionType(transaction) === 'send'">
						Sent
					</p>
					<p v-else-if="getTransactionType(transaction) === 'receive'">
						Received
					</p>
					<span>{{ getTime(transaction.time) }}</span>
				</div>
			</div>
			<div class="code">
				<template v-if="transaction.currency === 'BTC'">
					<img src="@/assets/images/crypto/btc.png" alt title />
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
			<div class="address" v-if="getTransactionType(transaction) === 'exchange'">
				{{ transaction.address }}
			</div>
			<div class="address" v-else-if="getTransactionType(transaction) === 'receive'">
				{{ transaction.source.To }}
			</div>
			<div class="address" v-else-if="getTransactionType(transaction) === 'send'">
				{{ transaction.source.From }}
			</div>
			<div class="amount">
				<p>
					{{
						getTransactionType(transaction) === 'send'
							? '-'
							: getTransactionType(transaction) === 'receive'
							? '+'
							: ''
					}}{{ formatCurrency(transaction.value, '', 5) }} {{ transaction.currency }}
				</p>
				<span
					>{{
						getTransactionType(transaction) === 'send'
							? '-'
							: getTransactionType(transaction) === 'receive'
							? '+'
							: ''
					}}{{ formatCurrency(transaction.valueUSD, '$') }} USD</span
				>
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
	methods: {
		formatDate(date) {
			const parsedDate = new Date(Date.parse(date));
			const stringDate = parsedDate.toString();

			const day = stringDate.slice(8, 10);
			const month = stringDate.slice(4, 7);
			const year = parsedDate.getFullYear();
			return `${month} ${day}, ${year}`;
		},
		getTime(date) {
			const parsedDate = new Date(Date.parse(date)).toString();
			return parsedDate.slice(16, 21);
		},
		getTransactionType(transaction) {
			if (!transaction.source.From && !transaction.source.To) {
				return 'exchange';
			} else if (transaction.source.From === transaction.currentWallet.toLowerCase()) {
				return 'send';
			} else if (transaction.source.To === transaction.currentWallet.toLowerCase()) {
				return 'receive';
			} else return 'unknown';
		},
	},
};
</script>
