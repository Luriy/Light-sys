import { ifAuthenticated } from '../checkAuth';
import Dapp from '@/pages/LkDapp/index';

export default [
	{
		path: '/dapp',
		redirect: '/dapp/top-25',
	},
	{
		path: '/dapp/:category',
		component: Dapp,
		beforeEnter: ifAuthenticated,
	},
];
