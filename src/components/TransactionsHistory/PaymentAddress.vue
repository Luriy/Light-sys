<template>
	<div class="flex flex-column" :class="{ 'code-column': transaction.type === 'exchange' }">
		<div
			class="address"
			v-if="transaction.type.includes('receive') || transaction.type === 'exchange'"
		>
			{{ transaction.source.From }}
		</div>
		<div
			class="address"
			v-if="transaction.type.includes('send') || transaction.type === 'exchange'"
		>
			{{ transaction.source.To }}
		</div>
	</div>
</template>
<script>
export default {
	props: ['transaction'],
};
</script>
<style></style>
