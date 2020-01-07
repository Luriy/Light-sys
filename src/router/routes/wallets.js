import LkWalletsAndAccounts from '@/pages/LkWalletsAndAccounts';
import LkPaymentWalletsCreate from '@/pages/LkPaymentWalletsCreate/index';
import LkPaymentAccountsCards from '@/pages/LkPaymentAccountsCards/index';
import { ifAuthenticated } from '../checkAuth';

export default [
	{
		name: 'LkWalletsAndAccounts',
		path: '/wallets',
		component: LkWalletsAndAccounts,
		beforeEnter: ifAuthenticated,
	},
	{
		name: 'LkPaymentAccountsCards',
		path: '/wallets/accounts-and-cards',
		component: LkPaymentAccountsCards,
		beforeEnter: ifAuthenticated,
	},
	{
		name: 'LkPaymentWalletsCreate',
		path: '/wallets/create-wallet',
		component: LkPaymentWalletsCreate,
		beforeEnter: ifAuthenticated,
	},
];
