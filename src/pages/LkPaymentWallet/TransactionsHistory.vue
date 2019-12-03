<template v-if="datesWithTransactions.length">
	<div>
		<div
			class="trans-list"
			v-for="datesWithTransaction in datesWithTransactions"
			:key="datesWithTransaction.date.toString()"
		>
			<div class="trans-date">{{ formatDate(datesWithTransaction.date) }}</div>
			<div
				class="trans-item"
				v-for="transaction in datesWithTransaction.transactions"
				:key="transaction.url"
				:class="{ active: openedOperation === transaction.url }"
			>
				<div class="trans-card">
					<div class="trans-top">
						<button class="btn">
							<span class="icon">
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
							</span>
							<div class="text">
								<p v-if="getTransactionType(transaction) === 'exchange'">Exchanged</p>
								<p v-else-if="getTransactionType(transaction) === 'send'">
									Sent
								</p>
								<p v-else-if="getTransactionType(transaction) === 'receive'">
									Received
								</p>
								<span>{{ getTime(transaction.time) }} PM</span>
							</div>
						</button>
						<div class="code">
							<img
								v-if="currentWallet.currency === 'BTC'"
								src="@/assets/images/btc.png"
								alt
								title
							/>
							<img
								v-if="currentWallet.currency === 'ETH'"
								src="@/assets/images/eth.png"
								alt
								title
							/>
							<img
								v-if="currentWallet.currency === 'LTC'"
								src="@/assets/images/ltc.svg"
								alt
								title
							/>
							<span :class="currentWallet.currency.toLowerCase()">{{ transaction.currency }}</span>
						</div>
						<div class="address" v-if="getTransactionType(transaction) === 'exchange'">
							{{ transaction.source.address }}
						</div>
						<div class="address" v-else-if="getTransactionType(transaction) === 'receive'">
							{{ transaction.source.From }}
						</div>
						<div class="address" v-else-if="getTransactionType(transaction) === 'send'">
							{{ transaction.source.To }}
						</div>
						<div class="trans-amount">
							<span class="text"
								>{{ Number(transaction.value).toFixed(5) }} {{ transaction.currency }}</span
							>
							<span class="icon" @click="handleOpenOperation(transaction.url)"></span>
						</div>
					</div>
					<div class="trans-info">
						<table>
							<thead>
								<tr>
									<th>
										<p>Date</p>
										<span>{{ transaction.source.Time }}</span>
									</th>
									<th>
										<p>Transaction ID</p>
										<span
											><a :href="transaction.url" target="_blank" class="trans-id">{{
												transaction.url.slice(24)
											}}</a></span
										>
									</th>
									<th>
										<p>Fee</p>
										<span>{{ '0.0003 ' + currentWallet.currency }}</span>
									</th>
									<th>
										<p v-if="getTransactionType(transaction) === 'send'">To</p>
										<p v-else-if="getTransactionType(transaction) === 'exchange'">To</p>
										<p v-else-if="getTransactionType(transaction) === 'receive'">
											From
										</p>

										<span v-if="getTransactionType(transaction) === 'send'">{{
											transaction.source.To
										}}</span>
										<span v-else-if="getTransactionType(transaction) === 'receive'">{{
											transaction.source.From
										}}</span>
										<span v-else-if="getTransactionType(transaction) === 'exchange'">{{
											transaction.address
										}}</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<!-- <tr>
									<td>
										<p>Now</p>
										<span>{{ 'now balance' }}</span>
									</td>
									<td colspan="3">
										<p>Feb 6th</p>
										<span>{{ 'prev balance' }}</span>
									</td>
								</tr> -->
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['currentWallet'],
	data() {
		return {
			openedOperation: null,
			datesWithTransactions: [],
		};
	},
	mounted() {
		this.$store
			.dispatch('wallet/GET_WALLET_OPERATIONS', {
				currency: this.currentWallet.currency,
				address: this.currentWallet.address,
			})
			.then((data) => {
				this.datesWithTransactions = data;
			});
	},
	methods: {
		formatDate(date) {
			const stringDate = date.toString();
			const day = stringDate.slice(8, 10);
			const month = stringDate.slice(4, 7);
			const year = date.getFullYear();
			return `${month} ${day}, ${year}`;
		},
		getTime(date) {
			const parsedDate = new Date(Date.parse(date)).toString();

			return parsedDate.slice(16, 21);
		},
		handleOpenOperation(url) {
			if (this.openedOperation === url) {
				this.openedOperation = null;
			} else {
				this.openedOperation = url;
			}
		},
		getTransactionType(transaction) {
			if (!transaction.source.From && !transaction.source.To) {
				return 'exchange';
			} else if (transaction.source.From === this.currentWallet.address.toLowerCase()) {
				return 'send';
			} else if (transaction.source.To === this.currentWallet.address.toLowerCase()) {
				return 'receive';
			} else return 'unknown';
		},
	},
};
</script>
<style></style>
