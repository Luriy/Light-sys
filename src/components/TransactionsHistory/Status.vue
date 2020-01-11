<template>
	<button class="btn">
		<span class="icon">
			<img v-if="transaction.type === 'exchange'" src="@/assets/images/transaction-exchange.svg" />
			<img
				v-else-if="transaction.type.includes('send')"
				src="@/assets/images/transaction-sent.svg"
			/>
			<img
				v-else-if="transaction.type.includes('receive')"
				src="@/assets/images/transaction-received.svg"
			/>
		</span>
		<div class="text transaction-status">
			<p v-if="transaction.type === 'exchange'">Exchanged</p>
			<p v-else-if="transaction.type.includes('send')">
				Sent
			</p>
			<p v-else-if="transaction.type.includes('receive')">
				Received
			</p>
			<span>{{ getTime(transaction.time) }}</span>
		</div>
	</button>
</template>
<script>
export default {
	props: ['transaction'],
	methods: {
		getTime(date) {
			const parsedDate = new Date(Date.parse(date)).toString();
			return parsedDate.slice(16, 21);
		},
	},
};
</script>
<style></style>
