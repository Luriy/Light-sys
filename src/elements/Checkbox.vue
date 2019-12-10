<template>
	<div
		class="checkbox-outer"
		:class="{ active: isActive }"
		@click="handleClick"
		@mouseenter="$emit('onMouseEnter')"
		@mouseleave="$emit('onMouseLeave')"
	>
		<img src="@/assets/images/icons/checkbox-tick-active.svg" v-if="isActive" />
		<img src="@/assets/images/icons/checkbox-tick-disabled.svg" v-if="isDisabled && !isActive" />
	</div>
</template>
<script>
export default {
	props: ['isActive', 'isDisabled'],
	methods: {
		handleClick() {
			this.$emit('onClick');
		},
	},
};
</script>
<style lang="scss" scoped>
.checkbox-outer {
	width: 25px;
	height: 25px;
	border-radius: 6px;
	background-color: #614990;
	display: flex;
	justify-content: center;
	align-items: center;

	&.active {
		background-color: #7751c0;
	}
}
</style>
