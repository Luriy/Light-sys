import LkWalletsAndAccounts from '@/pages/LkWalletsAndAccounts';
import { ifAuthenticated } from '../checkAuth';

export default {
	path: '/',
	component: LkWalletsAndAccounts,
	beforeEnter: ifAuthenticated,
};
