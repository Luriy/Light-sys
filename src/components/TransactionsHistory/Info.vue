<template>
	<div class="trans-info">
		<div
			class="table"
			:class="{
				'without-fee': transaction.type === 'receive',
				'with-fee': transaction.type === 'send',
				exchange: transaction.type === 'exchange',
				'crypto-fiat-receive': transaction.type === 'crypto-fiat-receive',
				'crypto-fiat-send': transaction.type === 'crypto-fiat-send',
			}"
		>
			<div class="th">
				<p>Date</p>
				<span>{{ getFullTime(transaction.time) }}</span>
			</div>
			<div class="th">
				<p>Transaction ID</p>
				<a :href="transaction.url" target="_blank" class="trans-id">{{
					transaction.type === 'crypto-fiat-send' || transaction.type === 'crypto-fiat-receive'
						? transaction.url.slice(12)
						: getTransactionId(transaction.url)
				}}</a>
			</div>
			<div class="th" v-if="transaction.type === 'exchange'">
				<p>
					Sent
				</p>
				<div class="flex">
					<span :class="transaction.currency.toLowerCase()">{{
						`${transaction.value.toFixed(5)} ${transaction.currency}`
					}}</span
					><span class="divider">|</span><span>${{ transaction.valueUSD.toFixed(2) }} USD</span>
				</div>
			</div>
			<div class="th" v-if="!transaction.type.includes('receive')">
				<p>Fee</p>
				<div class="inline-flex fee-wrapper">
					<span :class="transaction.currency.toLowerCase()"
						>{{ Math.abs(transaction.fee).toFixed(5) + ' ' + transaction.currency }}
					</span>
					<span class="divider">|</span>
					<span
						>${{
							Math.abs(transaction.feeUSD).toFixed(2) == 0 && transaction.feeUSD !== 0
								? 0.01
								: Math.abs(transaction.feeUSD).toFixed(2)
						}}
						USD</span
					>
				</div>
			</div>
			<div
				class="th"
				v-if="
					!transaction.type.includes('exchange') &&
						transaction.type !== 'crypto-fiat-receive' &&
						transaction.type !== 'crypto-fiat-send'
				"
			>
				<p>Confirmations</p>
				<span>{{ transaction.confirmations }}</span>
			</div>
			<div class="th" v-if="transaction.type === 'exchange'">
				<p>
					Received
				</p>
				<span :class="transaction.secondCurrency.toLowerCase()">{{
					`${transaction.secondValue.toFixed(5)} ${transaction.secondCurrency}`
				}}</span
				><span class="divider">|</span><span>${{ transaction.secondValueUSD.toFixed(2) }} USD</span>
			</div>

			<div class="th">
				<p v-if="transaction.type.includes('send')">
					To
				</p>
				<p v-else-if="transaction.type.includes('receive') || transaction.type === 'exchange'">
					From
				</p>
				<span v-if="transaction.type.includes('send')">{{ transaction.source.To }}</span>
				<span v-else-if="transaction.type.includes('receive') || transaction.type === 'exchange'">{{
					transaction.source.From
				}}</span>
			</div>
			<div
				class="th"
				v-if="transaction.type === 'crypto-fiat-receive' || transaction.type === 'exchange'"
			>
				<p>
					To
				</p>
				<span>{{ transaction.source.To }}</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['transaction'],
	methods: {
		getFullTime(date) {
			const parsedDate = new Date(Date.parse(date));

			const day = parsedDate.getDate();
			const formattedDay = day < 10 ? '0' + day : day;
			const month = Number(parsedDate.getMonth()) + 1;
			const formattedMonth = month < 10 ? '0' + month : month;
			const year = parsedDate.getFullYear();
			return `${formattedDay}/${month}/${year} ${this.getTime(date)}`;
		},
		getTime(date) {
			const parsedDate = new Date(Date.parse(date)).toString();
			return parsedDate.slice(16, 21);
		},
		getTransactionId(transactionUrl) {
			const splittedString = transactionUrl.split('/');
			const transId = splittedString[splittedString.length - 1];

			if (transId.includes('?')) {
				const transIdWithQuery = transId.split('?');
				const newTransId = transIdWithQuery[transIdWithQuery.length - 1];
				return newTransId;
			}

			return transId;
		},
	},
};
</script>
<style lang="scss" scoped>
.table.exchange {
	grid-template-columns: max-content minmax(100px, max-content) repeat(2, max-content) minmax(
			max-content,
			1fr
		);
	.th:not(:nth-of-type(n + 6)) {
		border-bottom: 1px solid #3b2665;
	}
	@media screen and (min-width: 1600px) {
		.th:last-of-type {
			grid-column: 3/5;
		}
		.th:nth-of-type(6) {
			grid-column: 1/3;
		}
	}
	@media screen and (max-width: 1600px) {
		grid-template-columns: minmax(100px, max-content) minmax(100px, max-content) max-content;
		.th:not(:last-of-type) {
			border-bottom: 1px solid #3b2665;
		}
		.th:last-of-type {
			grid-column: 1/3;
		}
	}
	@media screen and (max-width: 1100px) {
		grid-template-columns: max-content minmax(100px, max-content);
		.th:nth-of-type(2n) {
			border-right: none !important;
		}
		.th:not(:last-of-type) {
			border-bottom: 1px solid #3b2665;
		}
	}
}

.table.without-fee {
	grid-template-columns: max-content minmax(100px, max-content) max-content max-content;
	@media screen and (max-width: 1350px) {
		grid-template-columns: 150px minmax(100px, max-content) max-content;
		.th:not(:last-of-type) {
			border-bottom: 1px solid #3b2665;
		}
		.th:last-of-type {
			grid-column: 1/3;
		}
		// .th:nth-of-type(2) {
		//   border-right: none !important;
		// }
	}
}
.table.with-fee {
	grid-template-columns: max-content minmax(100px, max-content) max-content max-content max-content;

	@media screen and (max-width: 1500px) {
		grid-template-columns: 150px minmax(100px, max-content) max-content;
		.th:not(:last-of-type) {
			border-bottom: 1px solid #3b2665;
		}
		.th:nth-of-type(3) {
			border-right: none !important;
		}
		.th:nth-of-type(4) {
			grid-column: 1/2;
		}
		.th:last-of-type {
			grid-column: 2/3;
		}
	}
}
.table.crypto-fiat-receive,
.table.crypto-fiat-send {
	grid-template-columns: max-content minmax(100px, max-content) max-content max-content;
	@media screen and (max-width: 1300px) {
		grid-template-columns: max-content minmax(100px, max-content) max-content;
		.th:nth-of-type(3) {
			border-right: none !important;
		}
		.th:nth-of-type(4) {
			grid-column: 1/3;
		}
		.th:not(:last-of-type) {
			border-bottom: 1px solid #3b2665;
		}
	}
}
.table {
	display: grid;
	width: 100%;
	text-align: left;
	border: 1px solid #3b2665;
	border: none;
	box-shadow: 0 0 0 1px #3b2665;
	border-radius: 8px;
	overflow: hidden;
	a {
		text-decoration: none;
		// padding-bottom:3px;
		border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
	}
}
.divider {
	transform: translateY(-2px);
	font-size: 15px !important;
	margin: 0 3px;
	@media screen and (max-width: 1250px) {
		font-size: 14px !important;
	}
}
</style>
