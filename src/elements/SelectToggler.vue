<template>
	<button class="toggler" :class="{ active: active }">
		<div class="toggler-arrow"></div>
	</button>
</template>
<script>
export default {
	props: ['active'],
};
</script>
<style lang="scss" scoped>
.toggler {
	width: 20px;
	height: 20px;
	border-radius: 9px;
	background-color: #684e9c;
	display: flex;
	justify-content: center;
	align-items: center;
	&.active {
		transform: rotate(180deg);
	}
	.toggler-arrow {
		border: 3px solid transparent;
		border-top: 3px solid #9b84ca;
		margin-top: 3px;
		transition: 0.2s;
	}
}
</style>
