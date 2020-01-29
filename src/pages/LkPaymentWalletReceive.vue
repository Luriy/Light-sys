<template>
	<lk-layout>
		<div class="wallet-block">
			<div class="block-title">
				<img :src="getCryptoInfo($route.params.currency).image.corner" alt title />
				<router-link :to="{ name: 'LkPaymentWallet' }" class="close"
					><img src="@/assets/images/path.svg" alt title
				/></router-link>
			</div>

			<div class="wallet-address">
				<div class="wallet-title">
					Your {{ getCryptoInfo($route.params.currency).fullName }} Address
				</div>
				<div class="wallet-address-value" @click="copyToClipboard">
					<transition name="fade">
						<p v-if="isCopyClipboardNotify">Copied to clipboard</p>
						<p v-else>{{ $route.params.address }}</p>
					</transition>
					<div class="copy"><span>Copy</span></div>
				</div>
				<div class="qr">
					<img :src="qrCodeUrl" />
				</div>
				<div class="icons">
					<div class="icon" @click="printWallet">
						<span><img src="@/assets/images/print.svg"/></span>
						<p>Print This Address</p>
					</div>
					<div class="icon" @click="sendEmail">
						<span><img src="@/assets/images/envelope.svg"/></span>
						<p>Email This Address</p>
					</div>
					<a
						:href="getCryptoInfo($route.params.currency, $route.params.address).blockhainLink"
						target="_blank"
						class="icon"
					>
						<span><img src="@/assets/images/link.svg"/></span>
						<p>View On Blockchain</p>
					</a>
				</div>
			</div>
		</div>
	</lk-layout>
</template>

<script>
import qrcode from 'qrcode';
import LkLayout from '@/layout/LkLayout';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	components: {
		LkLayout,
	},
	data() {
		return {
			qrCodeUrl: '@/assets/images/bitmap.png',
			isCopyClipboardNotify: false,
		};
	},
	mounted() {
		qrcode
			.toDataURL(this.$route.params.address, {
				margin: 0,
				width: 170,
				color: {
					dark: '#260848FF',
					light: '#ffffffff',
				},
			})
			.then((url) => {
				this.qrCodeUrl = url;
			});
	},
	methods: {
		getCryptoInfo,
		sendEmail() {
			window.open(
				`mailto:?subject=LightNet ${
					this.getCryptoInfo(this.$route.params.currency).fullName
				} Address&body=My LightNet ${
					this.getCryptoInfo(this.$route.params.currency).fullName
				} address is: ` + this.$route.params.address,
			);
		},
		printWallet() {
			const win = window.open();
			win.document.write(this.$route.params.address);
			win.print();
			win.close();
		},
		copyToClipboard() {
			const el = document.createElement('textarea');
			el.value = this.$route.params.address;
			document.body.appendChild(el);
			el.select();

			try {
				document.execCommand('copy');
				this.isCopyClipboardNotify = true;
				setTimeout(() => (this.isCopyClipboardNotify = false), 3000);
			} catch (e) {}

			document.body.removeChild(el);
		},
	},
};
</script>
