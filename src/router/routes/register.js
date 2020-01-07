import Register from '@/pages/Register';
import { ifNotAuthenticated } from '../checkAuth';

export default {
	path: '/register',
	name: 'Register',
	component: Register,
	beforeEnter: ifNotAuthenticated,
};
