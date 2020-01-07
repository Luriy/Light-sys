<template>
	<router-link :to="link"
		><div class="close"><img src="@/assets/images/path.svg" alt title /></div
	></router-link>
</template>
<script>
export default {
	props: ['link'],
};
</script>
<style lang="scss" scoped>
.close {
	width: 36px;
	height: 36px;
	border-radius: 8px;
	background-color: #3b2665;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
