<template>
	<settings-item-parent :name="'Security'">
		<div class="settings-security">
			<div class="security d-flex align-items-center position-relative">
				<div class="level d-flex align-items-center">
					<span class="level-title">Security</span>
					<span class="level-status">Low</span>
					<img src="@/assets/images/smiles/cry.png" alt="" class="level-image align-self-center" />
				</div>
				<p class="hint">Take measures to protect your wallet from losses and grabs</p>
				<div class="bar">
					<v-progress-linear
						value="15"
						height="1"
						color="#ff3b3b"
						background-color="#452865"
					></v-progress-linear>
				</div>
			</div>
			<div class="actions-list flex flex-column">
				<div class="action flex justify-content-between align-items-center">
					<span class="action__text">Change pin code</span>
					<button class="toggler">
						<div class="toggler-arrow"></div>
					</button>
				</div>
				<div class="flex checkbox-wrapper">
					<p class="checkbox-wrapper__text">Entrance from Touch Id</p>
					<div class="slide-checkbox-wrapper">
						<slide-checkbox
							:isActive="isTouchIdActive"
							@onClick="handleChangeTouchId"
						></slide-checkbox>
					</div>
				</div>
				<div class="action flex justify-content-between align-items-center">
					<div class="flex align-items-center">
						<span class="action__text">Two-factor authentication</span>
						<div class="action__status">
							0/3
						</div>
					</div>
					<button class="toggler">
						<div class="toggler-arrow"></div>
					</button>
				</div>
				<div class="action flex justify-content-between align-items-center">
					<div class="flex align-items-center">
						<span class="action__text">Email Verification</span>
						<div class="action__status">
							Off
						</div>
					</div>
					<button class="toggler">
						<div class="toggler-arrow"></div>
					</button>
				</div>
				<div class="action flex justify-content-between align-items-center">
					<div class="flex align-items-center">
						<span class="action__text">Limit</span>
						<div class="action__status">
							Off
						</div>
					</div>
					<button class="toggler">
						<div class="toggler-arrow"></div>
					</button>
				</div>
			</div>
		</div>
	</settings-item-parent>
</template>
<script>
import SettingsItemParent from './SettingsItemParent';
import SlideCheckbox from '@/elements/SlideCheckbox';

export default {
	components: {
		SettingsItemParent,
		SlideCheckbox,
	},
	data() {
		return {
			isTouchIdActive: false,
		};
	},
	methods: {
		handleChangeTouchId() {
			this.isTouchIdActive = !this.isTouchIdActive;
		},
	},
};
</script>
<style lang="scss">
@import '../../assets/scss/common';
.settings-security {
	.security {
		border-radius: 24px;
		background-color: #1e0639;
		width: 100%;
		height: 92px;
		padding-left: 30px;
		margin-bottom: 40px;

		.level {
			.level-title {
				font-size: 24px;
				font-weight: 600;
				color: $general-font-color;
			}
		}

		.bar {
			position: absolute;
			width: calc(100% - 60px);
			bottom: 0;
			left: 30px;
			.v-progress-linear {
				border-radius: 3px;
				overflow: visible;
			}
			.v-progress-linear__determinate {
				box-shadow: 0 -1px 4px #ff3b3b;
				border-radius: 3px;
			}
		}

		.hint {
			color: $general-font-color;
			opacity: 0.5;
			font-size: 14px;
			line-height: 21px;
			margin-left: 50px;
		}
	}
	.level-status {
		margin: 0 5px 0 10px;
		font-size: 24px;
		color: #ff3b3b;
		font-weight: 600;
	}

	.action {
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		padding: 0 16px;
		margin-bottom: 20px;
		&:last-of-type,
		&:first-of-type {
			margin-bottom: 0;
		}
		&__text {
			font-weight: 600;
			color: #fff;
		}
		cursor: pointer;
	}
	.toggler {
		width: 20px;
		height: 20px;
		border-radius: 9px;
		background-color: #684e9c;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.toggler-arrow {
		border: 3px solid transparent;
		border-top: 3px solid #9b84ca;
		margin-top: 3px;
	}
	.checkbox-wrapper {
		margin: 32px 0;
		&__text {
			font-size: 14px;
			color: #fff;
			margin-right: 23px;
		}
	}
	.action__status {
		width: 36px;
		height: 26px;
		border-radius: 5px;
		background-color: #352556;
		margin-left: 19px;
		opacity: 0.7;
		color: #ffffff;
		font-size: 14px;
		line-height: 26px;
		text-align: center;
	}
}
</style>
