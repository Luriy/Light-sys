<template>
	<div
		class="flex flex-column align-items-flex-end position-relative"
		v-if="operationsWithPagination.some(({ transactions }) => transactions.length)"
	>
		<div class="transaction-types position-absolute d-flex">
			<button
				class="transaction-type"
				:class="{ active: type.name === activeTransactionType }"
				@click="handleClickTransactionType(type.name)"
				v-for="type in operationsWithPagination.filter(({ transactions }) => transactions.length)"
				:key="type.name"
			>
				<img :src="type.icon.src" :width="type.icon.width" />
			</button>
		</div>
		<transition name="fade">
			<div class="trans-list__wrapper">
				<div
					class="trans-list"
					v-for="(datesWithTransaction, index) in activeTransactions[activePage]"
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
							exchange: transaction.type.includes('exchange'),
							active: openedOperation === transaction.url + transaction.type,
							'plus-trans': transaction.type.includes('receive'),
						}"
					>
						<div class="trans-card">
							<div class="trans-top" @click="handleOpenOperation(transaction)">
								<button class="btn">
									<span class="icon">
										<img
											v-if="transaction.type.includes('exchange')"
											src="@/assets/images/transaction-exchange.svg"
										/>
										<img
											v-else-if="
												transaction.type.includes('send') && !transaction.type.includes('exchange')
											"
											src="@/assets/images/transaction-sent.svg"
										/>
										<img
											v-else-if="
												transaction.type.includes('receive') &&
													!transaction.type.includes('exchange')
											"
											src="@/assets/images/transaction-received.svg"
										/>
									</span>
									<div class="text transaction-status">
										<p v-if="transaction.type.includes('exchange')">Exchanged</p>
										<p
											v-else-if="
												transaction.type.includes('send') && !transaction.type.includes('exchange')
											"
										>
											Sent
										</p>
										<p
											v-else-if="
												transaction.type.includes('receive') &&
													!transaction.type.includes('exchange')
											"
										>
											Received
										</p>
										<span>{{ getTime(transaction.time) }}</span>
									</div>
								</button>
								<div class="code">
									<div class="flex flex-column code-column">
										<div
											class="flex align-items-center"
											v-if="transaction.type === 'exchange-receive'"
										>
											<img :src="getCryptoInfo(transaction.secondCurrency).image.corner" />
											<span :class="transaction.secondCurrency.toLowerCase()">{{
												getCryptoInfo(transaction.secondCurrency).fullName
											}}</span>
										</div>
										<div class="flex align-items-center">
											<img
												:src="
													transaction.isCard
														? getBankImage(transaction.psid, 'small')
														: getCryptoInfo(transaction.currency).image.corner
												"
											/>
											<span :class="!transaction.isCard && transaction.currency.toLowerCase()">{{
												transaction.isCard
													? getCurrencyInfo(transaction.currency).fullName
													: getCryptoInfo(transaction.currency).fullName
											}}</span>
										</div>
										<div
											class="flex align-items-center"
											v-if="transaction.type === 'exchange-send'"
										>
											<img :src="getCryptoInfo(transaction.secondCurrency).image.corner" />
											<span :class="transaction.secondCurrency.toLowerCase()">{{
												getCryptoInfo(transaction.secondCurrency).fullName
											}}</span>
										</div>
									</div>
								</div>
								<div
									class="address"
									:class="{
										isNotCryptoFiat: !(
											transaction.type === 'crypto-fiat-receive' ||
											transaction.type === 'crypto-fiat-send'
										),
									}"
									v-if="transaction.type.includes('receive')"
								>
									{{ transaction.source.From }}
								</div>
								<div
									class="address"
									:class="{
										isNotCryptoFiat: !(
											transaction.type === 'crypto-fiat-receive' ||
											transaction.type === 'crypto-fiat-send'
										),
									}"
									v-else-if="transaction.type.includes('send')"
								>
									{{ transaction.source.To }}
								</div>
								<div class="trans-amount">
									<div class="amount">
										<p>
											{{
												transaction.type.includes('receive')
													? '+'
													: transaction.type.includes('send') && transaction.value > 0
													? '-'
													: ''
											}}{{
												transaction.isCard
													? Number(transaction.value).toFixed(2)
													: Number(transaction.value).toFixed(5)
											}}
											{{ transaction.currency }}
										</p>
										<span
											>{{
												transaction.type.includes('receive')
													? '+'
													: transaction.type.includes('send') && transaction.value > 0
													? '-'
													: ''
											}}{{ formatCurrency(transaction.valueUSD, '$') }} USD</span
										>
									</div>
									<span class="icon"></span>
								</div>
							</div>
							<div class="trans-info">
								<div
									class="table"
									:class="{
										'without-fee':
											transaction.type === 'receive' || transaction.type === 'exchange-send',
										'with-fee': transaction.type === 'send',
										'exchange-receive': transaction.type === 'exchange-receive',
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
											transaction.type === 'crypto-fiat-send' ||
											transaction.type === 'crypto-fiat-receive'
												? transaction.url.slice(12)
												: getTransactionId(transaction.url)
										}}</a>
									</div>
									<div class="th" v-if="!transaction.type.includes('receive')">
										<p>Fee</p>
										<div class="flex fee-wrapper">
											<span :class="transaction.currentWallet.currency.toLowerCase()"
												>{{
													Math.abs(transaction.fee).toFixed(5) +
														' ' +
														transaction.currentWallet.currency
												}}
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
									<div class="th">
										<p v-if="transaction.type.includes('send')">
											To
										</p>
										<p v-else-if="transaction.type.includes('receive')">
											From
										</p>
										<span v-if="transaction.type.includes('send')">{{
											transaction.source.To
										}}</span>
										<span v-else-if="transaction.type.includes('receive')">{{
											transaction.source.From
										}}</span>
									</div>
									<div class="th" v-if="transaction.type === 'crypto-fiat-receive'">
										<p>
											To
										</p>
										<span>{{ transaction.source.To }}</span>
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
		</transition>

		<transition name="fade">
			<button
				:disabled="activePage === activeTransactions.length - 1"
				class="arrow-block"
				:class="{ disabled: activePage === activeTransactions.length - 1 }"
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
import getBankImage from '@/functions/getBankImage';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	props: ['operationsWithPagination'],
	data() {
		return {
			openedOperation: null,
			activePage: 0,
			activeTransactionType: 'crypto-transfer',
		};
	},
	computed: {
		activeTransactions() {
			const currentTransactionsType = this.operationsWithPagination.find(
				({ name }) => name === this.activeTransactionType,
			);
			return currentTransactionsType ? currentTransactionsType.transactions : [];
		},
	},
	methods: {
		throttle,
		getCryptoInfo,
		getBankImage,
		getCurrencyInfo,
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
		handleClickTransactionType(name) {
			this.activeTransactionType = name;
			this.activePage = 0;
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
.divider {
	transform: translateY(-2px);
	font-size: 15px !important;
	margin: 0 3px;
	@media screen and (max-width: 1250px) {
		font-size: 14px !important;
	}
}
.transaction-types {
	top: 9px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 15;
	@media screen and (max-width: 1250px) {
		top: 4px;
	}
}
.transaction-type {
	width: 30px;
	height: 30px;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #3b2665;
	margin-right: 10px;
	transition: 0s;
	&:last-of-type {
		margin-right: 0;
	}
	&.active {
		border: 1px solid rgba(255, 255, 255, 0.5);
	}
}

.trans-top {
	@media screen and (min-width: 1400px) {
		display: grid !important;
		grid-template-columns: repeat(4, 25%);
		& > * {
			width: 100% !important;
		}
	}
	display: flex !important;
}
</style>
