<template>
	<lk-layout>
		<div class="flex flex-column full-height">
			<div class="top-bar flex justify-content-between align-items-center">
				<div class="flex align-items-center">
					<span class="setting-name">{{ name }}</span>
					<div class="settings-icon-plate">
						<img :src="icon" />
					</div>
				</div>
				<back-to-previous-page-button :link="'/settings'"></back-to-previous-page-button>
			</div>
			<slot></slot>
		</div>
	</lk-layout>
</template>
<script>
import LkLayout from '@/layout/LkLayout';
import BackToPreviousPageButton from '@/elements/BackToPreviousPageButton';
import settings_list from '@/data/settings/settings_list';

export default {
	props: ['name'],
	components: {
		LkLayout,
		BackToPreviousPageButton,
	},
	computed: {
		icon() {
			return settings_list.find((setting) => setting.name === this.name).icon;
		},
	},
};
</script>
<style>
.top-bar {
	margin-bottom: 20px;
}
.setting-name {
	color: #fff;
}
.settings-icon-plate {
	width: 36px;
	height: 36px;
	margin-left: 10px;
	border-radius: 7px;
	background-color: #3b2665;
	display: flex;
	justify-content: center;
	align-items: center;
}
.step-number {
	font-size: 24px;
	font-weight: 600;
	color: #fff;
}
</style>
