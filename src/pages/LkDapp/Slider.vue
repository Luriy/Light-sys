<template>
	<div class="flex justify-content-between align-items-center">
		<div class="slider-visible-wrapper">
			<div
				class="slider-items flex"
				:style="{
					transform: `translateX(${-100 * activeSlide}%)`,
				}"
			>
				<div class="slider-item-big" v-for="(itemBig, index) in slides" :key="index">
					<div
						class="slider-item-small d-flex align-items-center justify-content-center"
						v-for="(itemSmall, index) in itemBig"
						:key="index"
					>
						<img :src="itemSmall.image" class="slider-image" />
					</div>
				</div>
			</div>
		</div>
		<div class="slider-arrows flex flex-column align-items-center">
			<img
				class="slider-arrow"
				src="@/assets/images/slider-arrow.svg"
				@click="handleClickNext"
				alt="Arrow right"
			/>
			<span class="slider-arrow-divider"></span>
			<img
				class="slider-arrow"
				src="@/assets/images/slider-arrow.svg"
				@click="handleClickPrev"
				alt="Arrow left"
			/>
		</div>
	</div>
</template>
<script>
export default {
	props: ['slides'],
	data() {
		return {
			activeSlide: 0,
		};
	},
	methods: {
		handleClickNext() {
			if (this.activeSlide !== this.slides.length - 1) {
				this.activeSlide++;
			}
		},
		handleClickPrev() {
			if (this.activeSlide !== 0) {
				this.activeSlide--;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.slider {
	&-arrows {
		margin-left: 55px;
		border-radius: 6px;
		border: 1px solid #38244f;
	}
	&-arrow-divider {
		width: 20px;
		height: 1px;
		background-color: #38244f;
	}
	&-arrow {
		padding: 15px 11px 12px;
		cursor: pointer;
		opacity: 0.8;
		transition: 0.2s;
		&:hover {
			opacity: 1;
		}
		&:last-of-type {
			transform: rotate(180deg);
		}
	}
	&-visible-wrapper {
		max-width: 100%;
		overflow: hidden;
		width: 100%;
		border-radius: 15px;
	}
	&-items {
		flex-wrap: nowrap;
		transition: 0.5s ease-in-out;
	}
	&-image {
		width: 100%;
		height: 100%;
	}
	&-item {
		&-big {
			min-width: calc(100% - 20px);
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 15px;
			margin: 0 10px;
		}
		&-small {
			width: 100%;
			height: 140px;
			border-radius: 15px;
		}
	}
}
</style>
