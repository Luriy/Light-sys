<template>
	<button class="view-more-btn" @click="$emit('onClick')">View more</button>
</template>
<script>
export default {};
</script>
<style scoped lang="scss">
.view-more-btn {
	width: 100%;
	height: 48px;
	border-radius: 8px;
	border: 1px solid #3d1867;
	background-color: transparent;
	text-align: center;
	line-height: 48px;
	font-weight: 600;
	opacity: 0.6;
	color: #ffffff;
	font-size: 14px;
	transition: 0.3s;
	&:hover {
		opacity: 1;
	}
}
</style>
