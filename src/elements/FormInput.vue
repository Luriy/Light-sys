<template>
	<div class="flex flex-column full-width">
		<span class="input-title">{{ title }}</span>
		<input :value="value" :placeholder="placeholder" class="input" />
		<div class="input-border"></div>
	</div>
</template>
<script>
export default {
	props: ['placeholder', 'value', 'title'],
};
</script>
<style lang="scss" scoped>
.input {
	color: #fff;
	opacity: 1;
	font-size: 16px;
	&-border {
		background-color: #533f7b;
		width: 100%;
		height: 2px;
		border-radius: 14px;
		margin-top: 10px;
	}
	&::placeholder {
		opacity: 0.6 !important;
		color: #ffffff;
		font-weight: 600;
		font-size: 16px;
	}
	&-title {
		opacity: 0.5;
		color: #ffffff;
		font-size: 12px;
		margin-bottom: 7px;
	}
}
</style>
