import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		CREATE_GROUP: (store, { GroupName, wallets }) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'AddWalletsGroup',
					...getAuthParams,
					GroupName,
					...wallets,
				},
			});
		},
	},
};
