<template>
	<div class="categories-block">
		<button
			v-for="category in gameCategories"
			:key="category.name"
			class="category d-flex align-items-center"
			:class="{ active: category.name === activeCategory }"
			@click="$emit('onChangeCategory', category.name)"
		>
			<img v-if="category.icon" :src="category.icon" class="category__icon" />
			{{ category.name }}
		</button>
	</div>
</template>
<script>
import gameCategories from '@/data/dapp/game_categories';

export default {
	data() {
		return {
			gameCategories,
		};
	},
	props: ['activeCategory'],
};
</script>
<style scoped lang="scss">
.categories-block {
	height: 51px;
	border-radius: 8px;
	background-color: #4d3779;
	display: flex;
	align-items: center;
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
</style>
