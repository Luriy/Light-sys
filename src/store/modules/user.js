import Vue from 'vue';
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user';
import { AUTH_LOGOUT } from '../actions/auth';
import { BASE_URL } from '@/settings/config';
import { getAuthParams } from '@/functions/auth';
import { parsePythonArray, parsePythonDataObject } from '@/functions/helpers';
import Axios from 'axios';

const state = {
	status: '',
	profile: {},
	allUsdBalance: JSON.parse(localStorage.getItem('StateAllUsdBalance')) || 0,
};

const getters = {
	getProfile: (state) => state.profile,
	isProfileLoaded: (state) => !!state.profile.name,
	ALL_USD_BALANCE: (state) => Number(state.allUsdBalance).toFixed(2),
};

const mutations = {
	[USER_REQUEST]: (state) => {
		state.status = 'loading';
	},
	[USER_SUCCESS]: (state, resp) => {
		state.status = 'success';
		Vue.set(state, 'profile', resp);
	},
	[USER_ERROR]: (state) => {
		state.status = 'error';
	},
	[AUTH_LOGOUT]: (state) => {
		state.profile = {};
	},
	SET_ALL_USD_BALANCE: (state, payload) => {
		localStorage.setItem('StateAllUsdBalance', payload);
		state.allUsdBalance = payload;
	},
};

const actions = {
	[USER_REQUEST]: ({ commit, dispatch }) => {},
	REGISTER: async (store, { loginType, user }) => {
		const response = await Axios({
			url: BASE_URL,
			method: 'POST',
			params: {
				Comand: 'Newaccount2',
				BIO: '',
				Passport: '',
				Phone: loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '',
				Email: loginType === 'Email' ? user : '',
			},
		});

		return parsePythonDataObject(response);
	},
	REGISTER_APPROVE: async (store, { user, loginType, smsCodes }) => {
		const response = await Axios({
			method: 'POST',
			url: BASE_URL,
			params: {
				Comand: 'AccountActivationPhone',
				Email: loginType === 'Email' ? user : '',
				Phone: loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '',
				Pin: smsCodes.map((smsCode, index) => smsCode[index]).join(''),
			},
		});
		return parsePythonDataObject(response);
	},
	SET_PASSWORD: async (store, { loginType, user, password }) => {
		const response = await Axios({
			method: 'POST',
			url: BASE_URL,
			params: {
				Comand: 'PasswordInstall',
				Email: loginType === 'Email' ? user : '',
				Phone: loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '',
				Password: password,
			},
		});

		return parsePythonDataObject(response);
	},
	RESEND_PASSWORD: (store, { Phone, Email }) => {
		return Axios({
			url: BASE_URL,
			method: 'POST',
			params: {
				Comand: 'ResendActivatedPin',
				Phone,
				Email,
			},
		}).then((resp) => {
			resp = parsePythonDataObject(resp);
			const errors = Object.values(resp[0]['Errors']);

			const data = {
				errors: [],
				success: false,
			};

			if (errors.length) {
				data.errors = errors;
			} else {
				data.success = true;
			}

			return data;
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
