<template>
	<div class="selects-block">
		<button class="select position-relative" v-for="select in selects" :key="select.label">
			<div class="flex align-items-center">
				<span class="select__text">{{ select.label }}</span>
				<span class="select__informer" v-if="select.informer">{{ select.informer }}</span>
			</div>
			<select-toggler :active="select.isOpened"></select-toggler>
			<div class="select-dropdown position-absolute"></div>
		</button>
	</div>
</template>
<script>
import SelectToggler from '@/elements/SelectToggler';

export default {
	components: { SelectToggler },
	data() {
		return {
			selects: [
				{
					label: 'Categories',
					informer: 1200,
					isOpened: false,
				},
				{
					label: 'Blockchains',
					isOpened: false,
				},
				{
					label: 'Sort by Relevance',
					isOpened: false,
				},
			],
		};
	},
	methods: {
		handleOpenSelect(select) {
			select.isOpened = !select.isOpened;
		},
	},
};
</script>
<style lang="scss" scoped>
.selects-block {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 20px;
	.select {
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		padding: 0 17px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-dropdown {
			max-height: 323px;
			left: 0;
			bottom: -10px;
		}
		&__text {
			color: #ffffff;
			font-weight: 600;
			line-height: 1;
		}
		&__informer {
			height: 25px;
			margin-left: 9px;
			line-height: 25px;
			border-radius: 8px;
			background-color: #341a51;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			padding: 0 8px;
		}
	}
}
</style>
