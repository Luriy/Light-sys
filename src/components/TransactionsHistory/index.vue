<template>
	<div
		class="flex flex-column align-items-flex-end position-relative"
		v-if="operationsWithPagination.some(({ transactions }) => transactions.length)"
	>
		<transactions-types
			@onClick="handleClickTransactionType"
			:types="operationsWithPagination.filter(({ transactions }) => transactions.length)"
			:activeTransactionType="activeTransactionType"
		></transactions-types>

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
							v-if="index === 0"
							:disabled="activePage === 0"
							class="arrow-block flex align-items-center absolute none-select"
							:class="{ disabled: activePage === 0 }"
							@click="throttle(handleClickMoveButton('top'), 1000)"
						>
							<img src="@/assets/images/arrow-up.svg" height="16" width="16" />
						</button>
					</transition>
				</div>
				<div
					class="trans-item operations-history-list-item"
					v-for="(transaction, index) in datesWithTransaction.transactions"
					:key="transaction.url + index"
					:class="{
						exchange: transaction.type === 'exchange',
						active: openedOperation === transaction.url + transaction.type,
						'plus-trans': transaction.type.includes('receive'),
					}"
				>
					<div class="trans-card">
						<div
							class="trans-top"
							@click="handleOpenOperation(transaction)"
							:class="{ exchange: transaction.type === 'exchange' }"
						>
							<status :transaction="transaction"></status>
							<currency :transaction="transaction"></currency>
							<paymentAddress :transaction="transaction"></paymentAddress>
							<amount :transaction="transaction"></amount>
						</div>
						<info :transaction="transaction"></info>
					</div>
				</div>
			</div>
		</div>

		<transition name="fade">
			<button
				:disabled="activePage === activeTransactions.length - 1"
				class="arrow-block none-select"
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
import Status from './Status';
import Currency from './Currency';
import PaymentAddress from './PaymentAddress';
import Amount from './Amount';
import Info from './Info';
import TransactionsTypes from './TrasactionsTypes';

export default {
	props: ['operationsWithPagination'],
	components: {
		Status,
		Currency,
		PaymentAddress,
		Amount,
		Info,
		TransactionsTypes,
	},
	data() {
		return {
			openedOperation: null,
			activePage: 0,
			activeTransactionType: 'all',
		};
	},
	mounted() {
		console.log(this.operationsWithPagination);
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
		handleOpenOperation(transaction) {
			if (this.openedOperation === transaction.url + transaction.type) {
				this.openedOperation = null;
			} else {
				this.openedOperation = transaction.url + transaction.type;
			}
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
.trans-top {
	display: grid;
	@media screen and (min-width: 1550px) {
		grid-template-columns: repeat(4, 25%) !important;
	}
	display: flex;
	& > * {
		width: 100% !important;
	}
	&.exchange {
		display: grid;
		grid-template-columns: repeat(4, max-content);
	}
}
</style>
