<template>
	<div>
		1
	</div>
</template>
<style scoped></style>
<script>
import { mapGetters } from 'vuex';

export default {
	mounted() {
		this.$store.dispatch('card/GET_CARDS');
	},
	computed: {
		...mapGetters({
			cards: 'common/BANKS',
		}),
	},
};
</script>
