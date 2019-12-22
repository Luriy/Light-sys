<template>
	<div class="flex flex-column align-items-flex-end">
		<div class="trans-list__wrapper">
			<div
				class="trans-list"
				v-for="(datesWithTransaction, index) in activePaginationPage"
				:key="datesWithTransaction.date.toString()"
			>
				<div class="trans-date">
					<p>{{ formatDate(datesWithTransaction.date) }}</p>
					<transition name="fade">
						<button
							:disabled="activePage === 0"
							class="arrow-block flex align-items-center absolute"
							:class="{ disabled: activePage === 0 }"
							@click="throttle(handleClickMoveButton('top'), 1000)"
							v-if="index === 0"
						>
							<img src="@/assets/images/arrow-up.svg" height="16" width="16" />
						</button>
					</transition>
				</div>
				<div
					class="trans-item operations-history-list-item"
					v-for="transaction in datesWithTransaction.transactions"
					:key="transaction.url + transaction.type"
					:class="{
						active: openedOperation === transaction.url + transaction.type,
						'plus-trans': transaction.type === 'receive',
					}"
				>
					<div class="trans-card">
						<div class="trans-top" @click="handleOpenOperation(transaction)">
							<button class="btn">
								<span class="icon">
									<img
										v-if="transaction.type === 'exchange'"
										src="@/assets/images/transaction-exchange.svg"
									/>
									<img
										v-else-if="transaction.type === 'send'"
										src="@/assets/images/transaction-sent.svg"
									/>
									<img
										v-else-if="transaction.type === 'receive'"
										src="@/assets/images/transaction-received.svg"
									/>
								</span>
								<div class="text transaction-status">
									<p v-if="transaction.type === 'exchange'">Exchanged</p>
									<p v-else-if="transaction.type === 'send'">
										Sent
									</p>
									<p v-else-if="transaction.type === 'receive'">
										Received
									</p>
									<span>{{ getTime(transaction.time) }}</span>
								</div>
							</button>
							<div class="code">
								<img
									v-if="transaction.currentWallet.currency === 'BTC'"
									src="@/assets/images/btc.png"
									alt
									title
								/>
								<img
									v-if="transaction.currentWallet.currency === 'ETH'"
									src="@/assets/images/eth.png"
									alt
									title
								/>
								<img
									v-if="transaction.currentWallet.currency === 'LTC'"
									src="@/assets/images/ltc.svg"
									alt
									title
								/>
								<span :class="transaction.currentWallet.currency.toLowerCase()">{{
									getCryptoInfo(transaction.currency).fullName
								}}</span>
							</div>
							<div class="address" v-if="transaction.type === 'exchange'">
								{{ transaction.source.address }}
							</div>
							<div class="address" v-else-if="transaction.type === 'receive'">
								{{ transaction.source.From }}
							</div>
							<div class="address" v-else-if="transaction.type === 'send'">
								{{ transaction.source.To }}
							</div>
							<div class="trans-amount">
								<div class="amount">
									<p>
										{{
											transaction.type === 'receive'
												? '+'
												: transaction.type === 'send' && transaction.value > 0
												? '-'
												: ''
										}}{{ formatCurrency(transaction.value, '', 5) }} {{ transaction.currency }}
									</p>
									<span
										>{{
											transaction.type === 'receive'
												? '+'
												: transaction.type === 'send' && transaction.value > 0
												? '-'
												: ''
										}}{{ formatCurrency(transaction.valueUSD, '$') }} USD</span
									>
								</div>
								<span class="icon"></span>
							</div>
						</div>
						<div class="trans-info">
							<div class="table" :class="{ 'without-fee': transaction.type === 'receive' }">
								<div class="th">
									<p>Date</p>
									<span>{{ getFullTime(transaction.time) }}</span>
								</div>
								<div class="th">
									<p>Transaction ID</p>
									<a :href="transaction.url" target="_blank" class="trans-id">{{
										getTransactionId(transaction.currency, transaction.url)
									}}</a>
								</div>
								<div class="th" v-if="transaction.type !== 'receive'">
									<p>Fee</p>
									<div class="fee-row">
										<span :class="transaction.currentWallet.currency.toLowerCase()"
											>{{
												Math.abs(transaction.fee).toFixed(5) +
													' ' +
													transaction.currentWallet.currency
											}}
										</span>
										<span class="divider">&nbsp;&nbsp;</span>
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
								<div class="th">
									<p v-if="transaction.type === 'send'">To</p>
									<p v-else-if="transaction.type === 'receive'">
										From
									</p>
									<p v-else-if="transaction.type === 'exchange'">To</p>

									<span v-if="transaction.type === 'send'">{{ transaction.source.To }}</span>
									<span v-else-if="transaction.type === 'receive'">{{
										transaction.source.From
									}}</span>
									<span v-else-if="transaction.type === 'exchange'">{{ transaction.address }}</span>
								</div>
								<!-- <div>
									<tr>
  									<td>
  										<p>Now</p>
  										<span>{{ 'now balance' }}</span>
  									</td>
  									<td colspan="3">
  										<p>Feb 6th</p>
  										<span>{{ 'prev balance' }}</span>
  									</td>
  								</tr>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<button
				:disabled="activePage === operationsWithPagination.length - 1"
				class="arrow-block arrow-block-bottom"
				:class="{ disabled: activePage === operationsWithPagination.length - 1 }"
				@click="throttle(handleClickMoveButton('bottom'), 1000)"
			>
				<img
					src="@/assets/images/arrow-up.svg"
					height="16"
					width="16"
					style="transform: rotate(180deg);"
				/>
			</button>
		</transition>
	</div>
</template>
<script>
import throttle from '@/functions/throttle';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	props: ['operationsWithPagination'],
	data() {
		return {
			openedOperation: null,
			activePage: 0,
			containerMaxHeight: 2500,
		};
	},
	computed: {
		activePaginationPage() {
			return this.operationsWithPagination[this.activePage];
		},
	},
	methods: {
		throttle,
		getCryptoInfo,
		handleClickMoveButton(direction) {
			if (direction === 'top') {
				this.activePage--;
			} else {
				this.activePage++;
			}
		},
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
		getFullTime(date) {
			const parsedDate = new Date(Date.parse(date));

			const day = parsedDate.getDate();
			const formattedDay = day < 10 ? '0' + day : day;
			const month = Number(parsedDate.getMonth()) + 1;
			const formattedMonth = month < 10 ? '0' + month : month;
			const year = parsedDate.getFullYear();
			return `${formattedDay}/${month}/${year} ${this.getTime(date)}`;
		},
		handleOpenOperation(transaction) {
			if (this.openedOperation === transaction.url + transaction.type) {
				this.openedOperation = null;
			} else {
				this.openedOperation = transaction.url + transaction.type;
			}
		},
		getTransactionId(transactionCurrency, transactionUrl) {
			switch (transactionCurrency) {
				case 'BTC':
					return transactionUrl.slice(37);
				case 'ETH':
					return transactionUrl.slice(24);
				case 'LTC':
					return transactionUrl.slice();
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.arrow-block {
	background-color: rgba(59, 38, 101, 0.8);
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	cursor: pointer;
	margin-right: 5px;
}
.arrow-block.disabled,
.arrow-block.disabled img {
	opacity: 0;
}
.arrow-block img {
	opacity: 0.8;
}
.arrow-block:hover {
	background-color: rgba(59, 38, 101, 1);
	box-shadow: 0 0 7px rgba(59, 38, 101, 1);
}
.arrow-block:hover img {
	opacity: 1;
}
.arrow-block-bottom {
	margin-bottom: 30px;
}
.trans-date {
	position: relative;
}
.arrow-block.absolute {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 0;
}
.trans-top {
	cursor: pointer;
}
.fee-row {
	.divider {
		display: none;
	}
	display: flex;
	flex-direction: column;
	@media screen and (max-width: 1200px) {
		flex-direction: row;
		.divider {
			display: inline;
		}
	}
}
</style>
