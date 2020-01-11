<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<span class="step-number">Step 4</span>
			<div class="flex flex-column align-items-center main-block">
				<img class="main-image" src="@/assets/images/lightnet-card.png" alt="Card" />
				<div class="flex align-items-center main-title__wrapper">
					<h2 class="main-title">Congratulations!</h2>
					<img src="@/assets/images/settings-success-icon.png" alt="Success" />
				</div>
				<p class="main-paragraph">Your application has been approved.</p>
			</div>
		</div>
	</transition>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.main {
	&-block {
		background-image: url('../../../assets/images/confirmation-success-bg.png');
		height: auto;
		@media screen and (max-width: 1400px) {
			height: 252px;
		}
		max-width: 670px;
		width: 100%;
		margin: 0 auto;
		@media screen and (min-width: 1400px) {
			padding-top: 25px;
		}
	}
	&-image {
		@media screen and (max-width: 1400px) {
			margin-top: -25px;
		}
	}
	&-title {
		&__wrapper {
			margin: 30px 0 20px;
			@media screen and (max-width: 1400px) {
				margin: 20px 0 10px;
			}
		}
		margin-right: 10px;
		font-size: 24px;
		font-weight: 600;
		color: #fff;
	}
	&-paragraph {
		opacity: 0.5;
		color: #ffffff;
		font-size: 16px;
	}
}
</style>
