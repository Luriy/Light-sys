export default {
	namespaced: true,
	state: {
		loading: false,
		notification: null,
	},
	getters: {
		loading(state) {
			return state.loading;
		},
		notification(state) {
			return state.notification;
		},
	},
	mutations: {
		setLoading(state, payload) {
			state.loading = payload;
		},
		setNotification(state, payload) {
			state.notification = payload;
		},
		clearNotification(state) {
			state.notification = null;
		},
	},
	actions: {
		setLoading({ commit }, payload) {
			commit('setLoading', payload);
		},
		setNotification({ commit }, payload) {
			commit('setNotification', payload);
		},
		clearNotification({ commit }) {
			commit('clearNotification');
		},
	},
};
