<template>
	<div class="wrapper">
        <v-text-field
            v-for="text in texts"
            :key="text.label"
            :label="text.label"
            background-color="#4d3779"
            full-width
            height="60px"
            solo
            color="#ffffff"
            class="input-title"
            style="margin-right:15px;"
            autofocus
        />
	</div>
</template>
<script>

export default {
	data() {
		return {
			texts: [
				{
					label: 'Enter the title',
				},
				{
					label: 'Enter short name',
				},
				{
					label: 'Description',
				},
			],
		};
	},
};
</script>
<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 15px;
}
.select-tokens-inside {
	width: 100%;
	height: 61px;
	padding-right: 14px;
	padding-left: 14px;
	padding: 0;
	margin-bottom: 2%;
	font-weight: 600;
	line-height: 21px;
}
.select-toggler-wrapper {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}
.select-token {
	height: 65px;
	position: relative;
}
.v-input,
.v-label {
	font-size: 14px important;
	-webkit-text-fill-color: #ffffff;
	font-family: 'Open Sans Semi Bold';
	font-weight: 600;
	line-height: 21px;
}
</style>
