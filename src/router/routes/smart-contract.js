import LkSmartContract from '@/pages/LkSmartContract';
import { ifAuthenticated } from '../checkAuth';

export default {
	path: '/smart-contract',
	component: LkSmartContract,
	beforeEnter: ifAuthenticated,
};
