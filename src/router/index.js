import Vue from 'vue';
import Router from 'vue-router';

import {
	root,
	login,
	settings,
	register,
	exchange,
	wallets,
	paymentsAndTransfer,
	smartContract,
	passwordRecovery,
} from './routes/index';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		root,
		login,
		register,
		passwordRecovery,
		exchange,
		smartContract,
		...settings,
		...wallets,
		...paymentsAndTransfer,
	],
});
