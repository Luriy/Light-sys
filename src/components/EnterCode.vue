<template>
	<div class="flex justify-content-between">
		<div
			v-bind:key="index"
			class="number-input-wrapper"
			v-for="(input, index) in smsCodes"
			:class="{ active: !input[index].length }"
		>
			<input
				class="number-input"
				v-model="input[index]"
				@keyup="$emit('onSmsKeyUp', $event, index)"
				type="text"
				maxLength="1"
				size="1"
				min="0"
				max="9"
				pattern="[0-9]{1}"
			/>
		</div>
	</div>
</template>
<script>
export default {
	props: ['smsCodes'],
};
</script>
<style lang="scss" scoped>
.number-input {
	&-wrapper {
		width: 50px;
		height: 50px;
		border-radius: 8px;
		background-color: #4d3779;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		&.active:after {
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 7px;
			width: 34px;
			height: 1px;
			background: #fff;
		}
	}
	border: none;
	color: #ffffff;
	text-align: center;
	font-size: 36px;
	font-weight: 600;
	height: 30px;
}
</style>
