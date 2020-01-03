<template>
	<div class="transaction-types position-absolute d-flex" v-if="$route.path === '/wallets'">
		<button
			class="transaction-type"
			:class="{ active: type.name === activeTransactionType }"
			@click="$emit('onClick', type.name)"
			v-for="type in types"
			:key="type.name"
		>
			<img :src="type.icon.src" :width="type.icon.width" v-if="type.icon" />
			{{ type.text ? type.text : '' }}
		</button>
	</div>
</template>
<script>
export default {
	props: ['types', 'activeTransactionType'],
};
</script>
<style lang="scss" scoped>
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
	font-size: 14px;
	color: #fff;
	border: 1px solid transparent;
	&:last-of-type {
		margin-right: 0;
	}
	&.active {
		border: 1px solid rgba(255, 255, 255, 0.5);
	}
}
</style>
