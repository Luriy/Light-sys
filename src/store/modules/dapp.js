import { DAPP_URL } from '@/settings/config';
import { getAuthParams } from '@/functions/auth';
import { parsePythonArray, parsePythonDataObject } from '@/functions/helpers';
import Axios from 'axios';
import fernet from 'fernet';

// const codeFernet = () => {
// 	const key = '6iP22EZcGOillpsPClgIqyucNOx_SeIlqH-TrpXVGd8=';
// 	const secret = new fernet.Secret(key);

// 	let token = new fernet.Token({
// 		secret,
// 		token:
// 			'Z0FBQUFBQmVHSVd2TDRxX0NTeUhXSWllVC1DZGtDN3k3QTFnZU05czdQdVhmSmtudWpjanktNkZ0Mk5nODNBekN5V0RUTXhHRUFyMmFSZzRTTWNpWlgxYXFLZV82YzF4bkpnV3B3YWx5bmZzUERxa1JQdVJLNTA9',
// 		ttl: 0,
// 	});
// 	token.decode();
// 	console.log(token, token.decode());
// };

const state = {};

const getters = {};

const mutations = {};

const actions = {
	TEST_FERNET: (store) => {
		// const { data } = Axios({
		// 	url: DAPP_URL,
		// 	method: 'POST',
		// 	params: {
		// 		Comand: 'SecondTrast',
		// 	},
		// });
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
