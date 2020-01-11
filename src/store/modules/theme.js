import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { BASE_URL } from '@/settings/config';

export default {
	namespaced: true,
	state: { allThemes: [] },
	getters: {
		ALL_THEMES: (state) => state.allThemes,
	},
	mutations: {
		SET_ALL_THEMES: (state, payload) => {
			state.allThemes = payload;
		},
	},
	actions: {
		GET_ALL_THEMES: async ({ commit }) => {
			const { data } = await Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'Styles',
				},
			});
			const styles = Object.values(parsePythonArray(data)['1'].return.Styles);
			commit('SET_ALL_THEMES', styles);
			return styles;
		},
	},
};
