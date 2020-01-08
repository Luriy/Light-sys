import Vue from 'vue';
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user';
import { AUTH_LOGOUT } from '../actions/auth';
import { API_URL } from '@/constants';
import { getAuthParams } from '@/functions/auth';
import { parsePythonArray, parsePythonDataObject } from '@/functions/helpers';
import Axios from 'axios';

const state = { status: '', profile: {}, allUsdBalance: 0 };

const getters = {
	getProfile: (state) => state.profile,
	isProfileLoaded: (state) => !!state.profile.name,
	ALL_USD_BALANCE: (state) => state.allUsdBalance,
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
	SET_ALL_USD_BALANCE: (state, payload) => (state.allUsdBalance = payload),
};

const actions = {
	[USER_REQUEST]: ({ commit, dispatch }) => {},
	USER_RESEND_PASSWORD: (store, { Phone, Email }) => {
		return Axios({
			url: API_URL,
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
