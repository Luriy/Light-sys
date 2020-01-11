<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<span class="step-number">Step 3</span>
			<div class="flex justify-content-center align-items-center main-block">
				<div class="qr__wrapper">
					<img src="@/assets/images/settings-qr.png" alt="qr" width="160" height="160" />
				</div>
				<div class="qr__description-block flex flex-column">
					<p class="qr__description-text_primary">
						Scan the QR code using the Lightnet app on your mobile phone to complete the face-check
						process.
					</p>
					<ul>
						<li class="flex align-items-center qr__description-text-row">
							<!-- <div class="qr__description-circle"></div> -->
							<p class="qr__description-text">
								No mobile app?
							</p>
							<a href="#" class="qr__description-link">Download</a>
						</li>
						<li class="flex align-items-flex-center qr__description-text-row">
							<!-- <div class="qr__description-circle"></div> -->
							<p class="qr__description-text">
								To find the function of scanning the QR Code, go to the section in the application.
								If you cannot find this feature, please download the latest version.
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
ul {
	padding-left: 0;
}
.main-block {
	margin-top: 20px;
}
.qr {
	&__wrapper {
		width: 232px;
		height: 232px;
		border-radius: 24px;
		background-color: #1e0639;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&__description-block {
		margin-left: 35px;
		max-width: 370px;
		width: 100%;
	}
	&__description-circle {
		width: 6px;
		height: 6px;
		background-color: #ff3b3b;
		border-radius: 50%;
		margin-right: 9px;
	}
	&__description-link {
		color: #c3a9f7;
		margin-left: 6px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
	}
	&__description-text {
		font-size: 14px;
		line-height: 21px;
		color: #fff;
		&-row {
			margin-bottom: 10px;
			position: relative;
			padding-left: 15px;
			&:before {
				left: 0;
				top: 8px;
				content: '';
				display: block;
				min-width: 6px;
				height: 6px;
				background-color: #ff3b3b;
				border-radius: 50%;
				margin-right: 9px;
				position: absolute;
			}

			&:last-of-type {
				margin-bottom: 0;
			}
		}
		&_primary {
			font-size: 14px;
			font-weight: 600;
			line-height: 23px;
			color: #fff;
			margin-bottom: 20px !important;
		}
	}
}
</style>
