<template>
	<div class="wallet-description" :class="{ active: isDescriptionOpened }">
		<div
			class="flex justify-content-between align-items-center description-header-block"
			@click="isDescriptionOpened = !isDescriptionOpened"
		>
			<div class="title none-select" :class="{ active: isDescriptionOpened }">
				By creating a token, you confirm that:
			</div>
			<button
				class="description-toggler flex align-items-center justify-content-center none-select"
			>
				<img
					src="@/assets/images/icons/arrow-big.svg"
					alt="Description toggler"
					class="description-toggler-image"
					:class="{ active: isDescriptionOpened }"
				/>
			</button>
		</div>
		<div class="wallet-description-outer" :class="{ active: isDescriptionOpened }">
			<div class="flex justify-content-between align-items-start wallet-description-text-wrapper">
				<div class="text">
					<p>
						I) You will not use it for fraudulent purposes;
					</p>
					<p>
						II) You do not duplicate in the name of the token in full or in part the name of
						existing cryptocurrencies or the names of well-known
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isDescriptionOpened: false,
		};
	},
};
</script>
<style scoped lang="scss">
.title {
	line-height: 21px;
	color: #fff;
	margin-bottom: 20px;
	font-size: 16px;
}
.wallet-description {
	transition: 0.5s;
	padding-bottom: 40px;
	position: relative;
}
.wallet-description.active {
	padding-bottom: 0;
}
.wallet-description-text-wrapper {
	transition: 0.2s;
	border: solid 1px #3b2665;
	padding: 10px 10px 15px 15px;
}
.wallet-description-outer {
	margin-top: 8px;
	max-height: 1px;
	transition: 0.5s;
	overflow: hidden;
}
.wallet-description-outer.active {
	padding-bottom: 40px;
	max-height: 300px;
	margin-top: 20px;
}
.wallet-description-outer.active .wallet-description-text-wrapper {
	border-radius: 8px;
}
.description-toggler {
	width: 29px;
	height: 29px;
	border-radius: 8px;
	background-color: #3b2665;
}
.title {
	transition: 0.4s;
	margin-bottom: 0 !important;
	opacity: 0.6;
}
.description-toggler-image {
	opacity: 0.6;
	transition: 0.4s;
}
.description-toggler-image.active {
	transform: rotate(180deg);
}
.description-header-block {
	cursor: pointer;
}
.description-header-block:hover .title,
.description-header-block .title.active,
.description-header-block:hover .description-toggler-image,
.description-header-block .description-toggler-image.active {
	opacity: 1;
}
.text {
	padding-top: 5px;
	font-size: 12px;
	line-height: 21px;
	color: rgba(255, 255, 255, 0.5);
}
/* .confirm-layout {
	width: 100%;
	height: 94px;
	border-radius: 8px;
	border: 1px solid #4d3779;
	margin: 0 auto;
	margin-bottom: 20px;
	position: relative;
	img {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background-color: #3b2665;
		position: absolute;
		cursor: pointer;
		margin: 32px 32px 33px 95%;
	}
	p {
		color: #ffffff;
		-webkit-text-stroke-color: #ffffff;
		font-family: 'Open Sans Semi Bold';
		width: 774px;
		height: 65px;
		opacity: 0.5;
		font-size: 12px;
		line-height: 21px;
		margin: 15px 144px 14px 15px;
		position: absolute;
	}
} */
</style>
