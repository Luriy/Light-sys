<template>
	<div class="wrapper" @click="$emit('onClick')">
		<div class="circle" :class="{ active: isActive }"></div>
	</div>
</template>
<script>
export default {
	props: ['isActive'],
};
</script>
<style lang="scss" scoped>
.wrapper {
	width: 48px;
	height: 26px;
	border-radius: 13px;
	background-color: #3b2665;
	position: relative;
	cursor: pointer;
}
.circle {
	width: 18px;
	height: 18px;
	background-color: #61db53;
	border-radius: 50%;
	position: absolute;
	top: 4px;
	left: 4px;
	transition: 0.2s;
	&.active {
		transform: translateX(22px);
	}
}
</style>
