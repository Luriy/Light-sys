import LkPaymentExchange from '@/pages/LkPaymentExchange';
import { ifAuthenticated } from '../checkAuth';

export default {
	path: '/exchange',
	name: 'LkPaymentExchange',
	component: LkPaymentExchange,
	beforeEnter: ifAuthenticated,
	props: true,
};
