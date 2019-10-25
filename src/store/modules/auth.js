import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import axios from 'axios';

const state = { 
	token: localStorage.getItem('Data') || '', 
	status: ''
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios({url: 'https://apidomenpyth.ru', data: user, method: 'POST' })
      .then(resp => {
      	resp = eval("("+resp['data']+")");
      	if(!resp[0]['Errors']['1007'] && !resp[0]['Errors']['1008']) {
      		if(resp[1]['return']['Login: '] == 'True') {      			
		        localStorage.setItem('Data', user)
		        commit(AUTH_SUCCESS, user)
		        resolve(resp)      		
      		} else {
      			let err = 'Неизвестная ошибка';
      			commit(AUTH_ERROR, err)
		        localStorage.removeItem('Data')
		        reject(err)     
      		}
      	} else {
      		let err = '';
      		(resp[0]['Errors']['1007']) ? err = resp[0]['Errors']['1007'] : err = resp[0]['Errors']['1008'];
	        commit(AUTH_ERROR, err)
	        localStorage.removeItem('Data')
	        reject(err)      		
      	}
      })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('Data')
      resolve()
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}