<template v-if="operations.length">
	<div>
		<div
			class="trans-list"
			v-for="datesWithTransaction in datesWithTransactions"
			:key="datesWithTransaction.date.toString()"
		>
			<div class="trans-date">{{ formatDate(datesWithTransaction.date) }}</div>
			<div
				class="trans-item"
				v-for="operation in datesWithTransaction.transactions"
				:key="operation.url"
				:class="{ active: openedOperation === operation.url }"
			>
				<div class="trans-card">
					<div class="trans-top">
						<button class="btn">
							<span class="icon">
								<img
									v-if="operation.source.From === operation.source.To"
									src="@/assets/images/transaction-exchange.svg"
								/>
								<img
									v-else-if="operation.source.From === currentWallet.address.toLowerCase()"
									src="@/assets/images/transaction-sent.svg"
								/>
								<img
									v-else-if="operation.source.To === currentWallet.address.toLowerCase()"
									src="@/assets/images/transaction-received.svg"
								/>
							</span>
							<div class="text">
								<p v-if="operation.source.From === operation.source.To">Exchanged</p>
								<p v-else-if="operation.source.From === currentWallet.address.toLowerCase()">
									Sent
								</p>
								<p v-else-if="operation.source.To === currentWallet.address.toLowerCase()">
									Received
								</p>
								<span>{{ operation.source.Time.slice(-5) }} PM</span>
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
							<span :class="currentWallet.currency.toLowerCase()">{{ operation.currency }}</span>
						</div>
						<div class="address" v-if="!operation.source.To && !operation.source.From">
							{{ operation.source.address }}
						</div>
						<div
							class="address"
							v-else-if="operation.source.To === currentWallet.address.toLowerCase()"
						>
							{{ operation.source.From }}
						</div>
						<div
							class="address"
							v-else-if="operation.source.From === currentWallet.address.toLowerCase()"
						>
							{{ operation.source.To }}
						</div>
						<div class="trans-amount">
							<span class="text"
								>{{ Number(operation.value).toFixed(5) }} {{ operation.currency }}</span
							>
							<span class="icon" @click="handleOpenOperation(operation.url)"></span>
						</div>
					</div>
					<div class="trans-info">
						<table>
							<thead>
								<tr>
									<th>
										<p>Date</p>
										<span>{{ operation.source.Time }}</span>
									</th>
									<th>
										<p>Transaction ID</p>
										<span
											><a :href="operation.url" target="_blank" class="trans-id">{{
												operation.url.slice(24)
											}}</a></span
										>
									</th>
									<th>
										<p>Fee</p>
										<span>{{ '0.0003 ' + currentWallet.currency }}</span>
									</th>
									<th v-if="operation.source.From || operation.source.To">
										<p v-if="operation.source.From === currentWallet.address.toLowerCase()">To</p>
										<p v-if="operation.source.To === currentWallet.address.toLowerCase()">From</p>
										<span v-if="operation.source.From === currentWallet.address.toLowerCase()">{{
											operation.source.To
										}}</span>
										<span v-if="operation.source.To === currentWallet.address.toLowerCase()">{{
											operation.source.From
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
		handleOpenOperation(url) {
			if (this.openedOperation === url) {
				this.openedOperation = null;
			} else {
				this.openedOperation = url;
			}
		},
	},
};
</script>
<style></style>
