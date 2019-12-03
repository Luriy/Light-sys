<template>
	<div class="error-block">
		<transition name="fade">
			<p class="error" v-show="error">
				{{ error }}
			</p>
		</transition>
	</div>
</template>
<style scoped>
.error {
	color: #db5353 !important;
	font-size: 12px !important;
	text-align: center;
	font-weight: 600;
	line-height: 12px;
}
.error-block {
	height: 12px;
	margin-top: 20px;
}
body .error-block .error {
	background-color: transparent !important;
	border: none !important;
}
</style>
<script>
export default {
	props: ['error'],
};
</script>
