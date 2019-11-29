import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import auth from './modules/auth';
import wallet from './modules/wallet';
import account from './modules/account';
import alerts from './modules/alerts';
import common from './modules/common';
import card from './modules/card';
import exchange from './modules/exchange';
import currency from './modules/currency';
import group from './modules/group';
import { BASE_URL } from '@/settings/config';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	modules: {
		auth,
		user,
		wallet,
		account,
		alerts,
		exchange,
		common,
		card,
		currency,
		group,
	},
	state: {
		urls: {
			base: BASE_URL,
		},
	},
	strict: debug,
});
