import { ifAuthenticated } from '../checkAuth';
import Dapp from '@/pages/LkDapp/index';

export default [
	{
		path: '/dapp',
		redirect: '/dapp/market',
	},
	{
		path: '/dapp/:category',
		component: Dapp,
		beforeEnter: ifAuthenticated,
	},
];
