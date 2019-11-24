<template>
	<div class="radio-outer" @click="handleClick">
		<transition name="fade-fast">
			<div class="radio-inner" v-if="isActive"></div>
		</transition>
	</div>
</template>
<script>
export default {
	props: ['isActive'],
	methods: {
		handleClick() {
			this.$emit('onClick');
		},
	},
};
</script>
<style scoped>
.radio-outer {
	width: 18px;
	height: 18px;
	border-radius: 6px;
	border: 2px solid #7751c0;
	display: flex;
	justify-content: center;
	align-items: center;
}
.radio-inner {
	width: 8px;
	height: 8px;
	border-radius: 2px;
	background-color: #7751c0;
}
</style>
