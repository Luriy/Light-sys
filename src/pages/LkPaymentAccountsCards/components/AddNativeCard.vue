<template>
	<form class="add-native-card flex" @click="$emit('onClickRadioButton')">
		<div class="block flex align-items-center">
			<radio-button
				id="physical-card"
				:isActive="isPhysicalCardChecked"
				@onClick="handleClickRadioButton('physical-card')"
			></radio-button>
			<label for="physical-card" class="label">Physical</label>
		</div>
		<div class="block flex align-items-center">
			<radio-button
				id="virtual-card"
				:isActive="isVirtualCardChecked"
				@onClick="handleClickRadioButton('virtual-card')"
			></radio-button>
			<label for="virtual-card" class="label">Virtual</label>
		</div>
		<checkbox
			:isActive="isApplied.checked"
			:isDisabled="isApplied.hovered"
			@onClick="handleSubmit"
			@onMouseEnter="isApplied.hovered = true"
			@onMouseLeave="isApplied.hovered = false"
		></checkbox>
	</form>
</template>
<script>
import RadioButton from '@/elements/RadioButton';
import Checkbox from '@/elements/Checkbox';

export default {
	props: ['isEditing'],
	data() {
		return {
			isPhysicalCardChecked: false,
			isVirtualCardChecked: false,
			isApplied: {
				hovered: false,
				checked: false,
			},
		};
	},
	components: {
		RadioButton,
		Checkbox,
	},
	methods: {
		handleClickRadioButton(name) {
			if (!this.isApplied.checked) {
				if (name === 'physical-card') {
					this.isPhysicalCardChecked = !this.isPhysicalCardChecked;
				} else if (name === 'virtual-card') {
					this.isVirtualCardChecked = !this.isVirtualCardChecked;
				} else return false;
			}
		},
		clearData() {
			this.isPhysicalCardChecked = false;
			this.isVirtualCardChecked = false;
			this.isApplied.checked = false;
		},
		handleSubmit() {
			if (this.isApplied.checked) {
				this.isApplied.checked = false;
			} else {
				if (this.isPhysicalCardChecked || this.isVirtualCardChecked) {
					this.isApplied.checked = true;
				} else {
					this.isPhysicalCardChecked = true;
					this.isVirtualCardChecked = true;
					this.isApplied.checked = true;
				}
			}

			if (this.isApplied.checked) {
				this.$emit('onAddNativeCard');
			} else {
				this.clearData();
				this.$emit('onCancel');
			}
		},
	},
	watch: {
		isEditing(value) {
			if (!value) {
				this.clearData();
			}
		},
	},
};
</script>
<style></style>
