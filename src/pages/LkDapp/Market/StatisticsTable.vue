<template>
	<div class="table">
		<div class="table-item">
			<div class="table-item-title">Smart Contracts</div>
			<div class="table-item-number">14 318</div>
		</div>
		<div class="table-item">
			<div class="table-item-title">Total Dapps</div>
			<div class="table-item-number">3 112</div>
		</div>
		<div class="table-item">
			<div class="table-item-title">24hr Users</div>
			<div class="table-item-number">107 888</div>
		</div>
		<div class="table-item">
			<div class="table-item-title">24hr Transactions</div>
			<div class="table-item-number">26 932 862</div>
		</div>
		<div class="table-item">
			<div class="table-item-title">24hr Volume USD</div>
			<div class="table-item-number">10 608 987</div>
		</div>
	</div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.table {
	margin-top: 30px;
	border-radius: 8px;
	border: 1px solid #502680;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: 1;
	&-item {
		padding: 40px 30px;
		&:not(:last-of-type) {
			border-right: 1px solid #502680;
		}
		&-title {
			opacity: 0.5;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			line-height: 21px;
			margin-bottom: 20px;
			text-align: center;
			white-space: nowrap;
		}
		&-number {
			color: #ffffff;
			font-size: 28px;
			font-weight: 600;
			line-height: 21px;
			text-align: center;
			white-space: nowrap;
		}
	}
}
</style>
