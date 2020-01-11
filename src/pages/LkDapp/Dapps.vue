<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<div class="search-input-wrapper">
				<input type="text" v-model="search" placeholder="Search" />
				<img src="@/assets/images/search.svg" />
			</div>
			<div class="categories-block">
				<button
					v-for="category in gameCategories"
					:key="category.name"
					class="category d-flex align-items-center"
					:class="{ active: category.name === activeCategory }"
					@click="handleClickCategory(category.name)"
				>
					<img v-if="category.icon" :src="category.icon" class="category__icon" />
					{{ category.name }}
				</button>
			</div>
			<div class="selects-block">
				<button class="select">
					<span class="select__text">Categories</span>
				</button>
				<select-toggler></select-toggler>
			</div>
		</div>
	</transition>
</template>
<script>
import gameCategories from '@/data/dapp/game_categories';
import SelectToggler from '@/elements/SelectToggler';

export default {
	data() {
		return {
			search: '',
			gameCategories,
			activeCategory: 'All categories',
		};
	},
	components: {
		SelectToggler,
	},
	methods: {
		handleClickCategory(category) {
			this.activeCategory = category;
		},
	},
	mounted() {
		this.$store.dispatch('dapp/TEST_FERNET');
	},
};
</script>
<style lang="scss" scoped>
.search-input-wrapper {
	height: 50px;
	border-radius: 8px;
	background-color: #3b2665;
	padding: 0 18px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	input {
		font-size: 14px;
		color: #fff;
		font-weight: 600;
		width: 95%;
		&::placeholder {
			font-size: 14px;
			color: #fff;
			opacity: 0.7 !important;
			font-weight: 600;
		}
	}
}
.categories-block {
	height: 51px;
	border-radius: 8px;
	background-color: #4d3779;
	display: flex;
	align-items: center;
	margin: 20px 0;
	padding: 0 10px;
	.category {
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
		padding: 0 9px;
		height: 35px;
		border-radius: 8px;
		margin-right: 5px;
		transition: 0.2s;
		&:hover {
			background-color: rgba(96, 73, 140, 0.6);
		}
		&.active {
			background-color: rgb(96, 73, 140);
		}
		&__icon {
			margin-right: 4px;
		}
		&:last-of-type {
			margin-left: auto;
			margin-right: 0;
		}
	}
}
.selects-block {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	.select {
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		padding: 17px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&__text {
			color: #ffffff;
			font-weight: 600;
			line-height: 1;
		}
		&__informer {
			height: 25px;
			border-radius: 8px;
			background-color: #341a51;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			padding: 8px 0;
		}
	}
}
</style>
