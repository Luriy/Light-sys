<template>
	<div class="wrapper">
		<v-select
			v-for="select in selects"
			:key="select.label"
			@click.native="handleClickSelect(select.label)"
			@blur="handleToggleSelect(select.label)"
			@change="handleToggleSelect(select.label)"
			:items="select.options"
			:label="select.label"
			background-color="#3b2665"
			item-color="white"
			solo
			height="65"
			class="select-main"
		>
			<template v-slot:append>
				<div class="select-toggler-wrapper position-absolute">
					<select-toggler :active="select.isSelected"></select-toggler>
				</div>
			</template>
		</v-select>
	</div>
</template>
<script>
import SelectToggler from '@/elements/SelectToggler';

export default {
	components: {
		SelectToggler,
	},
	data() {
		return {
			selects: [
				{
					label: 'Chose an option',
					options: ['Token', 'Stablecoin', 'Smart contract'],
					isSelected: false,
				},
				{
					label: 'Chose a network',
					options: ['Testnet', 'Mainnet'],
					isSelected: false,
				},
			],
		};
	},
	methods: {
		handleToggleSelect(label) {
			const currentSelect = this.selects.find((select) => select.label === label);
			currentSelect.isSelected = !currentSelect.isSelected;
		},
		handleClickSelect(label) {
			const prevSelect = this.selects.find((select) => select.isSelected);
			if (prevSelect) {
				prevSelect.isSelected = false;
			}

			const currentSelect = this.selects.find((select) => select.label === label);
			if (!currentSelect.isSelected) {
				currentSelect.isSelected = true;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 15px;
}
.select-tokens-inside {
	width: 100%;
	height: 61px;
	padding-right: 14px;
	padding-left: 14px;
	padding: 0;
	margin-bottom: 2%;
	font-weight: 600;
	line-height: 21px;
}
.select-toggler-wrapper {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}
.select-main {
	height: 65px;
    position: relative;
    width: 314px;
}
.v-input,
.v-label {
	font-size: 14px important;
	-webkit-text-fill-color: #ffffff;
	font-family: 'Open Sans Semi Bold';
	font-weight: 600;
	line-height: 21px;
}
</style>
