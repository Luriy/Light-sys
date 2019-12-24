<template>
	<lk-layout>
		<div class="wallet-block">
			<div class="block-title">
				<img
					v-if="$route.params.currency.toUpperCase() === 'BTC'"
					src="@/assets/images/crypto/btc.png"
					alt
					title
				/>
				<img
					v-if="$route.params.currency.toUpperCase() === 'ETH'"
					src="@/assets/images/eth.png"
					alt
					title
				/>
				<router-link :to="{ name: 'LkPaymentWallet' }" class="close"
					><img src="@/assets/images/path.svg" alt title
				/></router-link>
			</div>
			<div class="wallet-address">
				<div class="wallet-title">Your {{ currencyName }} Address</div>
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
					<a :href="linkBlockchain" target="_blank" class="icon">
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
	computed: {
		linkBlockchain() {
			switch (this.$route.params.currency.toUpperCase()) {
				case 'BTC':
					return `https://www.blockchain.com/ru/btc/address/${this.$route.params.address}`;
				case 'ETH':
					return `https://etherscan.io/address/${this.$route.params.address}`;
				case 'LTC':
					return `https://blockchair.com/litecoin/address/${this.$route.params.address}`;
				default:
					throw 'Unknown currency';
			}
		},
		currencyName() {
			let currencyName;

			switch (this.$route.params.currency.toUpperCase()) {
				case 'BTC':
					return 'Bitcoin';
				case 'ETH':
					return 'Ethereum';
				case 'LTC':
					return 'Litecoin';
				default:
					throw 'Unknown currency';
			}
		},
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
		sendEmail() {
			window.open(
				`mailto:?subject=LightNet ${this.currencyName} Address&body=My LightNet ${this.currencyName} address is: ` +
					this.$route.params.address,
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
