<template>
	<div class="popup-body" tabindex="0" ref="popup" @click="closeDialog" @keyup.esc="closeDialog">
		<div class="popup-wrapper" :style="popupSize" tabindex="1" @click.stop>
			<slot name="title" />
			<slot name="smsNumber"></slot>
			<slot name="body" />
			<slot name="buttons" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'LkPopUp',
	props: {
		popupSize: {
			type: Object,
			default: () => ({
				width: '597px',
				height: '500px',
			}),
		},
	},
	methods: {
		closeDialog() {
			this.$emit('closeModal', false);
		},
		repeatTransferRequest() {
			this.$emit('repeatTransferRequest');
		},
	},
  mounted () {
    const smsInput = document.getElementsByClassName('number-input');
    if (smsInput && smsInput.length) {
      smsInput[0].focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.success-popup_title {
	display: flex;
	flex-direction: column;
	align-items: center;

	.status {
		color: #ffffff;
		font-size: 36px;
		font-weight: 600;
		line-height: 21px;
	}

	.exchange-ammount {
		margin-top: 10px;
		font-size: 16px;
		@extend .status;
	}

	.icon-wrapper {
		width: 43px;
		height: 43px;
		margin: 30px 0;
		border-radius: 17px;
		background-color: #4d3779;
		color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.success-popup_body {
  width: 80%;
  flex-grow: 1;
  display: flex;
	flex-direction: column;
	align-items: center;
  justify-content: flex-end;

  .from, .to {
    margin-top: 16px;
    font-weight: 600;
    line-height: 27.2px;
  }

	.transaction-info {
		margin-top: 15px;
		margin-bottom: 15px;
    width: 100%;
	}

	.images {
		display: flex;
		margin: 15px 0;

    img {
      align-self: center;
      max-width: 34px;
      max-height: 39px;
    }
	}

	.success_arrows {
		margin: 0 26px;
	}
}

.popup-body {
	position: fixed;
	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(38, 8, 72, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;

	.popup-wrapper {
		z-index: 100;
		border-radius: 8px;
		background: #3b2665;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}
}

.exchange-popup_title {
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;

	.wrapper_exchange-fiat-icon {
		width: 67px;
		height: 67px;
		border-radius: 25px;
		background-color: #543b88;
		position: absolute;
		top: -33px;
		display: flex;
		justify-content: center;

		img {
			align-self: center;
			position: initial;
		}
	}

	img:first-child {
		position: absolute;
		top: -33px;
	}

	.question {
		opacity: 0.5;
		color: #ffffff;
		font-size: 14px;
		line-height: 21px;
		margin: 15px 0;
	}
	.transaction {
		color: #ffffff;
		text-align: center;
		padding-top: 30px;
		font-size: 28px;
		font-weight: 600;
		line-height: 35px;
	}

	.number-block {
		display: flex;

		.number {
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			line-height: 21px;
			margin-right: 5px;
		}

		.link {
			color: #f787ff;
			font-size: 14px;
			line-height: 21px;
		}
	}
}

.exchange-popup_buttons {
	.back {
		width: 88px;
		height: 50px;
		border-radius: 14px 14px 0 0;
		background-color: #4d3779;
		border: none;
		opacity: 0.5;
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
		line-height: 21px;
	}
}
.exchange-popup_info {
	display: flex;
	justify-content: space-between;

	.from {
		margin-left: 15px;
		color: #fda50c;
	}

	.to {
		margin-right: 15px;
		color: #7d8ef6;
	}
}

.exchange-popup_sms-number {
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.timer-body {
		display: flex;
		justify-content: center;
		margin-top: 25px;

		.title {
			color: #ffffff;
			opacity: 0.5;
			font-size: 14px;
			line-height: 21px;
			margin-right: 5px;
		}

		.timer {
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			line-height: 24px;
		}

		.repeat-btn {
			@extend .timer;
		}
	}

	.number-input {
		width: 50px;
		height: 50px;
		border-radius: 8px;
		background-color: #4d3779;
		border: none;
		color: #ffffff;
		text-align: center;
		font-size: 36px;
		font-weight: 600;
		line-height: 21px;
		&::placeholder {
			color: #ffffff;
			font-size: 14px;
		}
	}
}

.network-fee,
.balance {
	display: flex;
	opacity: 0.5;
	color: #ffffff;
	font-size: 12px;
	line-height: 21px;

	.network-fee__title {
		margin: 0;
    /*flex-grow: 1;*/

		span {
			text-transform: capitalize;
		}
	}

	.btc-value {
		margin-right: 30px;
	}
}

.exchange-popup_body {
	width: 477px;
	height: 113px;
	border-radius: 14px;
	background-color: #260848;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
}
</style>
