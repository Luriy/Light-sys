import { getAuthParams } from '@/functions/auth';
import { BASE_URL } from '@/settings/config';
import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { AUTH_LOGOUT } from '@/store/actions/auth';

export default {
	namespaced: true,
	actions: {
		TRANSFER_CRYPTO: (state, { amount, from, to, token, currency }) => {
			const { commit, dispatch } = state;
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: `${currency}Transfer`,
					...getAuthParams(),
					From: from,
					To: to,
					Token: token,
					Amount: amount,
				},
			}).then(({ data }) => {
				const response = parsePythonArray(data);
				const { Errors } = response[0];
				const responseData = response[1];
				if (!Object.keys(Errors).length && Object.keys(responseData['return']).length) {
					return { success: true, data: responseData.return };
				} else if (Object.values(Errors).includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
					return { success: false };
				} else if (Object.values(Errors).includes('Error token')) {
					commit(
						'alerts/setNotification',
						{
							message: 'PIN is not correct',
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { success: false };
				} else if (Object.keys(Errors).length) {
					const errKey = Object.keys(Errors)[0];
					commit(
						'alerts/setNotification',
						{
							message: Errors[errKey],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { success: false };
				} else {
					commit(
						'alerts/setNotification',
						{
							message: 'Transfer is unavailable now',
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
					return { success: false };
				}
			});
		},
		GET_TRANSFER_TOKEN: ({ commit, dispatch }, user) => {
			return Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'TransferToken',
					...user,
				},
			}).then(({ data }) => {
				const parsedData = parsePythonArray(data);
				const errors = Object.values(parsedData['0']['Errors']);
				if (errors.includes('Wrong password')) {
					dispatch(`${AUTH_LOGOUT}`, {}, { root: true }).then(
						() => (window.location.href = `/login`),
					);
				} else if (errors.length) {
					commit(
						'alerts/setNotification',
						{
							message: errors[0],
							status: 'error-status',
							icon: 'close',
						},
						{ root: true },
					);
				}
			});
		},
	},
};
