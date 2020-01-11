<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<div class="flex align-items-center">
				<span class="step-number">Step 1</span>
				<div class="validation-block flex flex-column">
					<div class="validation-block__item d-flex align-items-center">
						<div class="validation-block__status-error"></div>
						<span class="validation-block__text"
							>Applicant name must be intered exactly as it appears on applicant’s ID.</span
						>
					</div>
					<div class="validation-block__item d-flex align-items-center">
						<div class="validation-block__status-error"></div>
						<span class="validation-block__text"
							>Applicant name must be intered exactly as it appears on Certificate of
							Incorporation.</span
						>
					</div>
				</div>
			</div>
			<div class="form flex flex-column">
				<div class="form__input-wrapper">
					<form-input :title="'Applicant’s Name'" :placeholder="'Julia'"></form-input>
				</div>
				<div class="form__input-wrapper">
					<form-input :title="'Company Name'" :placeholder="'Microsoft'"></form-input>
				</div>
				<div class="form__input-wrapper">
					<div class="form__select">
						<div class="flex align-items-center">
							<img src="@/assets/images/russia.png" />
							<span class="form__select-title">Russia</span>
						</div>
						<select-toggler></select-toggler>
					</div>
				</div>
				<div class="form__input-wrapper">
					<form-input :title="'Contact Number'" :placeholder="'573 983'"></form-input>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import FormInput from '@/elements/FormInput';
import SelectToggler from '@/elements/SelectToggler';

export default {
	components: {
		FormInput,
		SelectToggler,
	},
};
</script>
<style lang="scss" scoped>
.validation-block {
	max-width: 640px;
	width: 100%;
	padding: 17px;
	border-radius: 24px;
	background-color: #1e0639;
	margin-left: 30px;
	&__status-error {
		width: 6px;
		height: 6px;
		background-color: #ff3b3b;
		border-radius: 50%;
		margin-right: 9px;
	}
	&__item {
		margin-bottom: 3px;
		&:last-of-type {
			margin-bottom: 0;
		}
	}
	&__text {
		font-size: 14px;
		color: #fff;
	}
}
.form {
	margin-top: 13px;
	&__select {
		padding: 0 18px;
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		&-title {
			font-weight: 600;
			color: #fff;
			margin-left: 8px;
		}
	}
	&__input-wrapper {
		margin-bottom: 30px;
		&:last-of-type {
			margin-bottom: 0;
		}
	}
}
</style>
