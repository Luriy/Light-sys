import Vue from 'vue'
import Router from 'vue-router'

import LkPayment from '@/pages/LkPayment'
import LkPaymentList from '@/pages/LkPaymentList'
import LkPaymentWallets from '@/pages/LkPaymentWallets'
import LkPaymentSend from '@/pages/LkPaymentSend'
import LkPaymentExchange from '@/pages/LkPaymentExchange'
import LkPaymentSendEth from '@/pages/LkPaymentSendEth'
import LkPaymentWalletsWalletsList from '@/pages/LkPaymentWalletsWalletsList'
import LkPaymentAccountsCards from '@/pages/LkPaymentAccountsCards'

import Login from '@/pages/Login'
import Register from '@/pages/Register'

import store from '../store'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
    	path:'/',
    	name: 'LkPaymentList',
    	component: LkPaymentList,
     	beforeEnter: ifAuthenticated
    },
    {
    	path:'/login',
    	name: 'Login',
    	component: Login,
        beforeEnter: ifNotAuthenticated,
    },
    {
    	path:'/register',
    	name: 'Register',
    	component: Register,
        beforeEnter: ifNotAuthenticated,
    },
    {
    	path:'/payments',
    	name: 'LkPaymentList',
    	component: LkPaymentList,
     	beforeEnter: ifAuthenticated
    },
    {
    	path:'/payments/address',
    	name: 'LkPayment',
    	component: LkPayment,
     	beforeEnter: ifAuthenticated
    },
    {
    	path:'/payments/send/btc',
    	name: 'LkPaymentSend',
    	component: LkPaymentSend,
     	beforeEnter: ifAuthenticated,
      	props: true
    },
    {
    	path:'/payments/send/eth',
    	name: 'LkPaymentSend',
    	component: LkPaymentSendEth,
     	beforeEnter: ifAuthenticated,
      	props: true
    },
    {
    	path:'/exchange',
    	name: 'LkPaymentExchange',
    	component: LkPaymentExchange,
     	beforeEnter: ifAuthenticated,
      	props: true
    },
    {
    	path:'/wallets',
    	name: 'LkPaymentWallets',
    	component: LkPaymentWallets,
     	beforeEnter: ifAuthenticated
    },
    {
    	path:'/wallets/wallets-list',
    	name: 'LkPaymentWalletsWalletsList',
    	component: LkPaymentWalletsWalletsList,
     	beforeEnter: ifAuthenticated
    },
    {
    	path:'/wallets/accounts-and-cards',
    	name: 'LkPaymentAccountsCards',
    	component: LkPaymentAccountsCards,
     	beforeEnter: ifAuthenticated
    },
  ]
})
