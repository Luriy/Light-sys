<template>
	<div class="header">
		<div class="right">
			<div class="search">
				<input type="text" name="search" placeholder="Search" />
				<button><img src="@/assets/images/search.svg" alt title /></button>
			</div>
			<div class="account-info">
				<div class="rating">
					<p><img src="@/assets/images/star-2.svg" alt title /> 4,56 <span> of 10</span></p>
				</div>
				<div class="balance">10 205.99 <span>USD</span></div>
				<div class="notification">
					<img src="@/assets/images/icons/bell.svg" alt title />
					<span></span>
				</div>
				<div class="avatar" @click="isDropDownOpened = !isDropDownOpened">
					<img src="@/assets/images/avatar.png" alt title />
					<div class="dropdown"></div>
					<dropdown :isOpened="isDropDownOpened" @onClose="isDropDownOpened = false"></dropdown>
				</div>
				<div class="lang">
					En
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Dropdown from './Dropdown';

export default {
	name: 'LkHeader',
	components: {
		Dropdown,
	},
	data() {
		return {
			isDropDownOpened: false,
		};
	},
};
</script>

<style scoped lang="scss">
.avatar {
	position: relative;
}
</style>
