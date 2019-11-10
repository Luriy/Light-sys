import Axios from 'axios'
import { parsePythonArray } from '@/functions/helpers'
import { getAuthParams } from '@/functions/auth'
import { API_URL } from '@/constants'

export default {
  namespaced: true,
  state: {
    allBalance: {}
  },
  getters: {
    ALL_BALANCE: state => state.allBalance
  },
  mutations: {
    SET_ALL_BALANCE: (state, payload) => (state.allBalance = payload)
  },
  actions: {
    GET_ALL_BALANCE: store => {
      return Axios({
        url: API_URL,
        method: 'POST',
        params: {
          Comand: 'AllBalance',
          ...getAuthParams()
        }
      }).then(({ data }) => {
        const returnData = parsePythonArray(data)['1'].return.AllBalance
        return store.commit('SET_ALL_BALANCE', returnData)
      })
    }
  }
}
