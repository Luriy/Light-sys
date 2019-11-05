import Vue from 'vue'
import Vuex from 'vuex'
import {additional, main} from './modules/';
import {BASE_URL} from '@/settings/config';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    ...additional,
    ...main
  },
  state: {
    urls: {
      base: BASE_URL,
    }
  },
  strict: debug,
})
