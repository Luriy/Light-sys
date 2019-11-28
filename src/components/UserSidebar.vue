<template>
	<div class="sidebar">
		<ul>
			<li v-for="link in links" :key="link.to">
				<router-link :to="link.to" :class="{ 'router-link-active': (link.to === '/wallets' && $route.path === '/')  }">
					<img :src="link.image" />
					<p>{{ link.text }}</p>
				</router-link>
			</li>
		</ul>
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
