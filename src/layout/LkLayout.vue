<template>
	<div class="lk-wrapper">
		<lk-header></lk-header>
		<div id="container">
			<user-sidebar></user-sidebar>
			<div class="content"><slot></slot></div>
		</div>
	</div>
</template>

<script>
import UserSidebar from '@/components/UserSidebar';
import LkHeader from '@/components/LkHeader';
export default {
  name: 'LkLaouyt',
  components: {
  	UserSidebar,
  	LkHeader
  }
}
</script>
<style lang="scss"></style>
