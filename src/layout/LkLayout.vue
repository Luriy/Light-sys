<template>
	<div class="lk-wrapper">
		<lk-header></lk-header>
		<div id="container">
			<user-sidebar></user-sidebar>
			<div class="content">
				<transition name="fade" appear>
					<slot></slot>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import UserSidebar from '@/components/UserSidebar';
import LkHeader from '@/components/LkHeader/index';
export default {
	name: 'LkLayout',
	components: {
		UserSidebar,
		LkHeader,
	},
};
</script>
<style lang="scss"></style>
