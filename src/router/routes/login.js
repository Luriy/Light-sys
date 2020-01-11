import Login from '@/pages/Login';
import { ifNotAuthenticated } from '../checkAuth';

export default {
	path: '/login',
	name: 'Login',
	component: Login,
	beforeEnter: ifNotAuthenticated,
};
