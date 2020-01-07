import LkPayFor from '@/pages/LkPayFor/index';
import LkPaymentWallet from '@/pages/LkPaymentWallet/index';
import LkPaymentWalletSend from '@/pages/LkPaymentWalletSend/index';
import LkPaymentWalletReceive from '@/pages/LkPaymentWalletReceive';
import { ifAuthenticated } from '../checkAuth';

export default [
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
];
