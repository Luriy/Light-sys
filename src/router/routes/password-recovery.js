import { ifNotAuthenticated } from '../checkAuth';
import PasswordRecovery from '@/pages/PasswordRecovery';

export default {
	path: '/password-recovery',
	component: PasswordRecovery,
	beforeEnter: ifNotAuthenticated,
};
