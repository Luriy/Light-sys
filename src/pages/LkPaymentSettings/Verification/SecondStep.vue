<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<span class="step-number">Step 2</span>
			<div class="main-block flex flex-column align-items-center">
				<div class="google-form flex flex-column align-items-start">
					<p class="google-form__text">
						Click below to complete a short form, then return here to proceed with your application
					</p>
					<a href="http://goo.gl/LN9PDy" class="google-form__link">http://goo.gl/LN9PDy</a>
					<div class="flex align-items-center radio-wrapper">
						<radio-button
							:isActive="isGoogleFormSubmitted"
							@onClick="handleSubmitGoogleForm"
						></radio-button>
						<p class="radio-wrapper__text">I have submitted the Google form</p>
					</div>
				</div>
				<div class="google-form__hints-block">
					<p class="google-form__hint">
						After ticking «I have submitted the Google form», please continue to submit your ID.
					</p>
					<p class="google-form__hint">
						We recomended <span>using a passport</span> for the applicant’s verification.
					</p>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import RadioButton from '@/elements/RadioButton';

export default {
	components: {
		RadioButton,
	},
	data() {
		return {
			isGoogleFormSubmitted: false,
		};
	},
	methods: {
		handleSubmitGoogleForm() {
			this.isGoogleFormSubmitted = !this.isGoogleFormSubmitted;
		},
	},
};
</script>
<style lang="scss" scoped>
.main-block {
	margin-top: 45px;
}
.google-form {
	border-radius: 24px;
	background-color: #1e0639;
	padding: 17px 23px 27px;
	max-width: 640px;
	width: 100%;
	&__text {
		font-size: 14px;
		color: #fff;
	}
	&__link {
		color: #c3a9f7;
		font-weight: 700;
		font-size: 14px;
		text-decoration: none;
		margin-top: 8px;
	}
	&__hints-block {
		margin-top: 30px;
		padding-left: 23px;
		max-width: 640px;
		width: 100%;
	}
	&__hint {
		font-size: 14px;
		color: #fff;
		margin: 0 !important;
		span {
			font-weight: 700;
		}
	}
}
.radio-wrapper {
	margin-top: 20px;
	&__text {
		margin-left: 8px;
		font-size: 14px;
		font-weight: 700;
		color: #fff;
	}
}
</style>
