import Settings from '@/pages/LkPaymentSettings/index';
import SettingsSecurity from '@/pages/LkPaymentSettings/Security';
import SettingsAccount from '@/pages/LkPaymentSettings/Account';
import SettingsNotifications from '@/pages/LkPaymentSettings/Notifications';
import SettingsDecor from '@/pages/LkPaymentSettings/Decor';
import SettingsSupportCenter from '@/pages/LkPaymentSettings/SupportCenter';
import SettingsVerification from '@/pages/LkPaymentSettings/Verification/index';
import SettingsReferralSystem from '@/pages/LkPaymentSettings/ReferralSystem';
import SettingsLanguages from '@/pages/LkPaymentSettings/Languages';
import SettingsLightnetEcosystem from '@/pages/LkPaymentSettings/LightnetEcosystem';
import { ifAuthenticated } from '../checkAuth';

export default [
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/security',
		name: 'SettingsSecurity',
		component: SettingsSecurity,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/account',
		name: 'SettingsAccount',
		component: SettingsAccount,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/notifications',
		name: 'SettingsNotifications',
		component: SettingsNotifications,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/decor',
		name: 'SettingsDecor',
		component: SettingsDecor,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/support-center',
		name: 'SupportCenter',
		component: SettingsSupportCenter,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/verification',
		name: 'SettingsVerification',
		component: SettingsVerification,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/referral-system',
		name: 'SettingsReferralSystem',
		component: SettingsReferralSystem,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/languages',
		name: 'SettingsLanguages',
		component: SettingsLanguages,
		beforeEnter: ifAuthenticated,
	},
	{
		path: '/settings/lightnet-ecosystem',
		name: 'SettingsLightnetEcosystem',
		component: SettingsLightnetEcosystem,
		beforeEnter: ifAuthenticated,
	},
];
