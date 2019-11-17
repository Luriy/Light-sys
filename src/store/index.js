import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import auth from './modules/auth';
import wallet from './modules/wallet';
import account from './modules/account';
import alerts from './modules/alerts';
import common from './modules/common';
import card from './modules/card';
import { BASE_URL } from '@/settings/config';
import exchange from './modules/exchange';
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
	},
	state: {
		urls: {
			base: BASE_URL,
		},
	},
	strict: debug,
});
