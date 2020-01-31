<template>
	<div class="flex flex-column">
		<img
			class="triangle"
			src="@/assets/images/triangle-small.svg"
			alt="Triangle top"
			@click="$emit('onClickTop')"
		/>
		<img
			class="triangle"
			src="@/assets/images/triangle-small.svg"
			alt="Triangle bottom"
			@click="$emit('onClickBottom')"
		/>
	</div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.triangle {
	cursor: pointer;
	&:first-of-type {
		margin-bottom: 3px;
	}
	&:last-of-type {
		transform: rotate(180deg);
	}
}
</style>
