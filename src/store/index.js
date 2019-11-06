import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import auth from './modules/auth'
import wallet from './modules/wallet'
import alerts from './modules/alerts'
import {BASE_URL} from '@/settings/config'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    user,
    wallet,
    alerts
  },
  state: {
    urls: {
      base: BASE_URL,
    }
  },
  strict: debug,
})
