<template>
	<div class="selects-block">
		<button class="select" v-for="select in selects" :key="select.label">
			<div class="flex align-items-center">
				<span class="select__text">{{ select.label }}</span>
				<span class="select__informer" v-if="select.informer">{{ select.informer }}</span>
			</div>
			<select-toggler :active="true"></select-toggler>
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
};
</script>
<style></style>
