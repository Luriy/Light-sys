import Axios from 'axios';
import { parsePythonArray, parsePythonDataObject } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';

export default {
	namespaced: true,
	state: {
		cards: JSON.parse(localStorage.getItem('stateCards')) || [],
	},
	getters: {
		CARDS: (state) => state.cards,
	},
	mutations: {
		SET_CARDS: (state, payload) => {
			state.cards = payload;
			localStorage.setItem('stateCards', JSON.stringify(payload));
		},
	},
	actions: {
		GET_CARDS: (store) => {
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CardInfo',
					Currency: true,
					...getAuthParams(),
				},
			}).then(({ data }) => {
				const returnData = parsePythonArray(data)['1'].return.Cards;
				const result = Object.values(returnData)
					.filter((item) => item.Status !== 'Frozen')
					.map((item) => ({
						...item,
						Holder: decodeURI(item.Holder),
					}));
				store.commit('SET_CARDS', result);
				return result;
			});
		},
		CREATE_CARD: (store, payload) => {
			const { Holder, Number, Psid, Currency } = payload;
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CreateCard',
					...getAuthParams(),
					Holder,
					Number,
					Psid,
					Currency,
					Cvv: '',
					Data: '',
				},
			}).then((data) => parsePythonDataObject(data));
		},
		DELETE_CARD: (store, payload) => {
			const { NumberCard } = payload;
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'FrozenCard',
					...getAuthParams(),
					NumberCard,
				},
			}).then((data) => {
				return parsePythonDataObject(data);
			});
		},
		UPDATE_CARD: (store, payload) => {
			const { NumberCard, NewNumber, NewHolder, NewPsid } = payload;
			return Axios({
				url: API_URL,
				method: 'POST',
				params: {
					Comand: 'CardEdit',
					...getAuthParams(),
					NumberCard,
					NewNumber,
					NewHolder,
					NewPsid,
				},
			}).then((data) => {
				return parsePythonDataObject(data);
			});
		},
	},
};
