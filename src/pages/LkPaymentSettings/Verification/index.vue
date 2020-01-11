<template>
	<settings-item-parent :name="'Verification'">
		<first-step v-show="currentStep === 1"></first-step>
		<second-step v-show="currentStep === 2"></second-step>
		<third-step v-show="currentStep === 3"></third-step>
		<fourth-step v-show="currentStep === 4"></fourth-step>
		<steps-controller
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="handleClickBackButton"
			@onClickNextButton="handleClickNextButton"
		></steps-controller>
	</settings-item-parent>
</template>
<script>
import SettingsItemParent from '../SettingsItemParent';
import StepsController from './StepsController';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import FourthStep from './FourthStep';

export default {
	components: {
		SettingsItemParent,
		StepsController,
		FirstStep,
		SecondStep,
		ThirdStep,
		FourthStep,
	},
	data() {
		return {
			currentStep: 1,
			steps: ['Basic info', 'Google form', 'Facial Information', 'Adoption'],
		};
	},
	methods: {
		handleClickBackButton() {
			if (this.currentStep !== 1) {
				this.currentStep--;
			}
		},
		handleClickNextButton() {
			if (this.currentStep !== this.steps.length) {
				this.currentStep++;
			}
		},
	},
};
</script>
<style lang="scss" scoped></style>
