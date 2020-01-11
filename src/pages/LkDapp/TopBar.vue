<template>
	<div class="flex justify-content-between align-items-center wrapper">
		<div class="categories-list flex">
			<router-link
				v-for="section in sections"
				:key="section.link"
				:to="`/dapp/${section.link}`"
				class="category"
				:class="{
					active:
						activeSection ===
						section.name
							.toLowerCase()
							.split(' ')
							.join('-'),
				}"
			>
				{{ section.name }}
			</router-link>
		</div>
		<div class="submit-btn">
			<img src="@/assets/images/download-icon.svg" class="submit-btn__icon" />
			<span class="submit-btn__text">Submit Dapp</span>
		</div>
	</div>
</template>
<script>
import sections from '@/data/dapp/sections';

export default {
	props: ['activeSection'],
	data() {
		return {
			sections,
		};
	},
};
</script>
<style lang="scss" scoped>
.wrapper {
	margin-bottom: 30px;
}
.category {
	opacity: 0.5;
	color: #ffffff;
	font-size: 14px;
	font-weight: 600;
	margin-right: 30px;
	text-decoration: none;
	&:last-of-type {
		margin-right: 0;
	}
	&.active {
		opacity: 1;
	}
}
.submit-btn {
	padding: 0 15px;
	height: 40px;
	border-radius: 12px;
	background-color: #3b2665;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&__text {
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
	}
	&__icon {
		margin-right: 10px;
	}
}
</style>
