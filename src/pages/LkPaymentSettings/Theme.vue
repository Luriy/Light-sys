<template>
	<settings-item-parent :name="'Theme'">
		<div class="flex flex-column align-items-start full-height">
			<span class="theme__title">Personalize your favorite color, texture or skin.</span>
			<div class="theme__choose-wrapper">
				<div
					class="theme__choose-item"
					v-for="theme in allThemes"
					@click="handleChangeTheme(theme)"
					:key="theme"
					:style="
						`
              background-color: ${themesInfo.find(({ name }) => name === theme).color};
            `
					"
				>
					<div class="theme__choose-item-text">{{ theme }}</div>
					<div class="theme__choose-item-active" v-show="activeTheme === theme">
						<img src="@/assets/images/tick.svg" />
					</div>
				</div>
			</div>
		</div>
	</settings-item-parent>
</template>
<script>
import SettingsItemParent from './SettingsItemParent';
import { mapGetters } from 'vuex';
import themesInfo from '@/settings/themesInfo';

export default {
	components: {
		SettingsItemParent,
	},
	data() {
		return {
			themesInfo,
			activeTheme: 'Blue',
		};
	},
	async created() {
		this.$store.dispatch('theme/GET_ALL_THEMES');
	},
	computed: {
		...mapGetters({
			allThemes: 'theme/ALL_THEMES',
		}),
	},
	methods: {
		handleChangeTheme(themeName) {
			this.activeTheme = themeName;
		},
	},
};
</script>
<style lang="scss" scoped>
.theme {
	&__title {
		opacity: 0.5;
		color: #ffffff;
		font-size: 14px;
		margin-bottom: 15px;
	}
	&__choose-wrapper {
		height: 100%;
		background: url('../../assets/images/theme_bg.png');
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&__choose-item {
		width: 120px;
		height: 120px;
		border-radius: 19px;
		margin-right: 22px;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		cursor: pointer;
		position: relative;

		&:last-of-type {
			margin-right: 0;
		}
		&-text {
			font-weight: 600;
			color: #fff;
			margin-bottom: 21px;
		}
		&-active {
			position: absolute;
			top: 0px;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			justify-content: center;
			align-items: center;
			width: 44px;
			height: 44px;
			border-radius: 17px;
			background-color: #7156a5;
		}
	}
}
</style>
