<template>
	<div class="trans-amount">
		<div class="flex flex-column code-column">
			<div class="amount plus-trans" v-if="transaction.type === 'exchange'">
				<p class="plus">
					+{{
						transaction.isCard
							? Number(transaction.secondValue).toFixed(2)
							: Number(transaction.secondValue).toFixed(5)
					}}
					{{ transaction.secondCurrency }}
				</p>
			</div>
			<div class="amount">
				<p>
					{{
						transaction.type.includes('receive')
							? '+'
							: (transaction.type.includes('send') && transaction.value > 0) ||
							  transaction.type === 'exchange'
							? '-'
							: ''
					}}{{
						transaction.isCard
							? Number(transaction.value).toFixed(2)
							: Number(transaction.value).toFixed(5)
					}}
					{{ transaction.currency }}
				</p>
				<span v-if="transaction.type !== 'exchange'"
					>{{
						transaction.type.includes('receive')
							? '+'
							: transaction.type.includes('send') && transaction.value > 0
							? '-'
							: ''
					}}${{ transaction.valueUSD }} USD</span
				>
			</div>
		</div>

		<span class="icon"></span>
	</div>
</template>
<script>
export default {
	props: ['transaction'],
};
</script>
<style lang="scss" scoped>
.plus {
	color: #61db53 !important;
}
</style>
