import Vue from 'vue';
import { parsePythonDataObject } from '@/functions/helpers';
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user';
import { AUTH_LOGOUT } from '../actions/auth';
import { API_URL } from '@/constants';
import Axios from 'axios';

const state = { status: '', profile: {} };

const getters = {
	getProfile: (state) => state.profile,
	isProfileLoaded: (state) => !!state.profile.name,
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
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
