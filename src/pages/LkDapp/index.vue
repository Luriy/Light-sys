<template>
	<lk-layout>
		<div class="flex flex-column">
			<top-bar :activeSection="activeSection"></top-bar>
			<top25 v-show="activeSection === 'top-25'"></top25>
			<market v-show="activeSection === 'market'"></market>
			<dapps v-show="activeSection === 'dapps'"></dapps>
			<community v-show="activeSection === 'community'"></community>
		</div>
	</lk-layout>
</template>
<script>
import LkLayout from '@/layout/LkLayout';
import TopBar from './TopBar';
import Top25 from './Top25';
import Market from './Market/index';
import Dapps from './Dapps/index';
import Community from './Community';

export default {
	data() {
		return {};
	},
	components: {
		LkLayout,
		TopBar,
		Top25,
		Market,
		Dapps,
		Community,
	},
	computed: {
		activeSection() {
			return this.$route.params.category;
		},
	},
};
</script>
<style lang="scss" scoped></style>
