<template>
	<div class="accounts-list_wrapper_tab_body">
		<div class="accounts-list_wrapper_tab_body_title">
			In what currency do I open an account?
		</div>
		<div class="accounts-list_wrapper_tab_body_table">
			<div
				class="accounts-list_wrapper_tab_body_table_tr"
				v-for="(item, index) in tableData"
				:key="item.full"
			>
				<div class="currency">
					<div class="icon">{{ item.code }}</div>
					<div class="text">{{ item.full }}</div>
				</div>
				<!-- <div class="right">
					<button v-if="item.isActive">Apply</button>
					<div class="checkbox" v-bind:class="{ active: item.isActive }"></div>
				</div> -->
				<checkbox
					@onMouseEnter="checkboxes[index].isHovered = true"
					@onMouseLeave="checkboxes[index].isHovered = false"
					@onClick="checkboxes[index].isChecked = !checkboxes[index].isChecked"
					:isDisabled="checkboxes[index].isHovered"
					:isActive="checkboxes[index].isChecked"
				></checkbox>
			</div>
		</div>
	</div>
</template>
<script>
import Checkbox from '@/elements/Checkbox';

export default {
	props: ['tableData'],
	components: {
		Checkbox,
	},
	data() {
		return {
			checkboxes: this.tableData.map((_) => ({
				isChecked: false,
				isHovered: false,
			})),
		};
	},
};
</script>
<style></style>
