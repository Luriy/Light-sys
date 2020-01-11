<template>
	<div class="wrapper flex justify-content-between">
		<button class="btn-back" @click="$emit('onClickBackButton')">Back</button>
		<div class="timeline flex justify-content-between align-items-center">
			<div class="timeline__item-wrapper" v-for="(step, index) in steps" :key="step">
				<transition name="fade-fast">
					<div class="timeline__item" v-show="index >= currentStep"></div>
				</transition>
				<transition name="fade-fast">
					<div class="timeline__item active" v-show="index < currentStep">
						<span>{{ index + 1 }}</span>
						<span class="step-description">{{ steps[index] }}</span>
					</div>
				</transition>
			</div>
		</div>
		<div class="btn-next-wrapper" @click="$emit('onClickNextButton')">
			<button class="btn-next">Next</button>
		</div>
	</div>
</template>
<script>
export default {
	props: ['currentStep', 'steps'],
};
</script>
<style lang="scss" scoped>
.wrapper {
	margin: 50px 0 10px;
}
.btn-back {
	min-width: 120px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	border-radius: 28px;
	background-color: #4d3779;
	font-weight: 600;
	color: #fff;
}
.btn-next {
	&-wrapper {
		min-width: 120px;
		height: 50px;
		border-radius: 28px;
		background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
	}
	width: calc(100% - 2px);
	height: calc(100% - 2px);
	margin: 1px 0 0 1px;
	border-radius: 28px;
	background-color: #260848;
	color: #fff;
	text-align: center;
	line-height: 48px;
	font-weight: 600;
}
.timeline {
	margin: 0 40px;
	width: 100%;
	position: relative;
	&:after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		height: 1px;
		background-color: #3b2665;
	}
	&__item {
		&-wrapper {
			width: 39px;
			height: 39px;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			&:last-of-type {
				margin-right: -24px;
			}
		}
		z-index: 5;
		width: 15px;
		height: 15px;
		background-color: #3b2665;
		color: #fff;
		border-radius: 50%;
		transition: 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		&.active {
			width: 100%;
			height: 100%;
		}
		.step-description {
			opacity: 0.5;
			color: #ffffff;
			position: absolute;
			bottom: -34px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 14px;
			white-space: nowrap;
			font-weight: 400;
		}
	}
}
</style>
