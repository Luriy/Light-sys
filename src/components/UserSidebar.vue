<template>
	<div class="sidebar flex flex-column align-items-start">
		<router-link to="/" class="logo"><img src="@/assets/images/logo.png" alt title/></router-link>
		<div class="sidebar__list-wrapper">
			<ul class="sidebar__list">
				<li v-for="link in links" :key="link.to">
					<router-link
						:to="link.to"
						:class="{ 'router-link-active': link.to === '/wallets' && $route.path === '/' }"
					>
						<img :src="link.image" />
						<p>{{ link.text }}</p>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import user_sidebar_links from '@/data/sidebar/user_sidebar_links';

export default {
	name: 'UserSidebar',
	data() {
		return {
			links: user_sidebar_links,
		};
	},
};
</script>
<style scoped lang="scss">
.logo {
	padding: 0 40px 0 30px;
}
.sidebar__list {
	padding: 0 40px 0 20px !important;
	margin-left: 10px;
	direction: rtl;
	& * {
		direction: ltr;
	}
	margin-top: 30px;
	max-height: calc(100vh - 30px - 52px - 40px);
	overflow-y: scroll;
	scrollbar-width: thin;
	scrollbar-color: #3b2665 transparent;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb,
	&::-webkit-scrollbar-thumb:hover {
		border-radius: 3px;
		background-color: #3b2665;
	}
	@media screen and (max-width: 1200px) {
		max-height: calc(100vh - 20px - 52px - 20px);
		margin-top: 20px;
	}
	&-wrapper {
		position: relative;
		&:after {
			content: '';
			z-index: 15;
			display: block;
			position: absolute;
			width: 100%;
			height: 25px;
			bottom: -3px;
			left: 0;
			background: linear-gradient(to top, #2c1559, transparent);
		}
	}
}
</style>
