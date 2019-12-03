import Vue from 'vue';
import Router from 'vue-router';

import LkPaymentWallet from '@/pages/LkPaymentWallet/index';
import LkWalletsAndAccounts from '@/pages/LkWalletsAndAccounts';
import LkPaymentWalletSend from '@/pages/LkPaymentWalletSend/index';
import LkPaymentWalletReceive from '@/pages/LkPaymentWalletReceive';
import LkPaymentExchange from '@/pages/LkPaymentExchange';
// import LkPaymentSendEth from '@/pages/LkPaymentSendEth'
import LkPaymentWalletsCreate from '@/pages/LkPaymentWalletsCreate/index';
import LkPaymentAccountsCards from '@/pages/LkPaymentAccountsCards/index';
import LkPayFor from '@/pages/LkPayFor/index';
import PasswordRecovery from '@/pages/PasswordRecovery';

import Login from '@/pages/Login';
import Register from '@/pages/Register';

import store from '../store';

const ifNotAuthenticated = (to, from, next) => {
	if (!store.getters.isAuthenticated) {
		next();
		return;
	}
	next('/');
};

const ifAuthenticated = (to, from, next) => {
	if (store.getters.isAuthenticated) {
		next();
		return;
	}
	next('/login');
};

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: LkWalletsAndAccounts,
			beforeEnter: ifAuthenticated,
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			beforeEnter: ifNotAuthenticated,
		},
		{
			path: '/register',
			name: 'Register',
			component: Register,
			beforeEnter: ifNotAuthenticated,
		},
		{
			path: '/exchange',
			name: 'LkPaymentExchange',
			component: LkPaymentExchange,
			beforeEnter: ifAuthenticated,
			props: true,
		},

		// WALLETS
		{
			path: '/wallets',
			name: 'LkWalletsAndAccounts',
			component: LkWalletsAndAccounts,
			beforeEnter: ifAuthenticated,
		},
		{
			path: '/wallets/accounts-and-cards',
			name: 'LkPaymentAccountsCards',
			component: LkPaymentAccountsCards,
			beforeEnter: ifAuthenticated,
		},
		{
			path: '/wallets/create-wallet',
			component: LkPaymentWalletsCreate,
			beforeEnter: ifAuthenticated,
		},
		{
			name: 'LkPaymentWallet',
			path: '/payments-and-transfer/:currency/:address',
			component: LkPaymentWallet,
			beforeEnter: ifAuthenticated,
		},
		{
			name: 'LkPaymentWalletSend',
			path: '/payments-and-transfer/send/:currency/:address',
			component: LkPaymentWalletSend,
			beforeEnter: ifAuthenticated,
		},
		{
			name: 'LkPaymentWalletReceive',
			path: '/payments-and-transfer/receive/:currency/:address',
			component: LkPaymentWalletReceive,
			beforeEnter: ifAuthenticated,
		},
		{
			name: 'LkPayFor',
			path: '/payments-and-transfer/pay-for',
			component: LkPayFor,
			beforeEnter: ifAuthenticated,
		},
		{
			path: '/payments-and-transfer',
			redirect: '/payments-and-transfer/pay-for',
		},
		{
			path: '/password-recovery',
			component: PasswordRecovery,
			beforeEnter: ifNotAuthenticated,
		},
	],
});
