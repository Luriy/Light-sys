<template>
	<div class="login-wrapper">    
		<div class="righttop"><img src="@/assets/images/bg1.png" alt title></div>
		<div class="leftbottom"><img src="@/assets/images/bg2.png" alt title></div>
		<div class="header">
			<a href="/" class="logo"><img src="@/assets/images/logo.png" alt title></a>
		</div>
		<div id="container">
			<div class="content"><slot></slot></div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'LoginLaouyt',
  components: {
  }
}
</script>
<style lang="scss" scoped>
	.header {
		position:absolute;
		top: 40px;
		left: 30px;
	}
	.righttop {
		position: absolute;
		top: 0;
		right: 0;
	}
	.leftbottom {
		position: absolute;
		bottom: 0;
		left: 0;
	}
</style>