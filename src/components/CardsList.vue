<template>
  <div class="wallets-list_item_body">
    <div 
      class="wallet fiat-wallet list__item" 
      v-for="(item, idx) in trans"
      :class="{active: item.isactive}" 
      @click="handleClick(item)" 
      :key="idx"
     >
     <transition name="fade">
      <div class="btn-remove" v-show="isCardsDeleting" @click="handleDeleteItem(idx)">
        <img src="@/assets/images/cross.svg"/>
      </div>
     </transition>
      <div class="wallet-info">
        <div class="code">
          <div class="image fiat">{{item.ico}}</div>
          <span>{{item.code}}</span>
        </div>
        <div class="right">
          <div class="balance">
            {{item.balance}}
          </div>
          <div class="wallet-toggle"></div>
        </div>
      </div>
      <div class="wallet-last-transactions">
        <div class="wallet-last-transactions-item">
          <div class="from">
            <div class="image">
              <img src="@/assets/images/lightnet.png" alt title>
            </div>
            <span>NEO bank</span>
          </div>
          <div class="info">
            <div class="amount">12, 500{{item.ico}}</div>
            <div class="type"><img src="@/assets/images/cloud.svg" alt title></div>
          </div>
        </div>
        <div class="wallet-last-transactions-item">
          <div class="from">
            <div class="image">
              <img src="@/assets/images/lightnet.png" alt title>
            </div>
            <span>NEO bank</span>
          </div>
          <div class="info">
            <div class="amount">17, 352{{item.ico}}</div>
            <div class="type"><img src="@/assets/images/left-arrow-purple.svg" alt title></div>
          </div>
        </div>
        <div class="wallet-last-transactions-item">
          <div class="from">
            <div class="image">
              <img src="@/assets/images/lightnet.png" alt title>
            </div>
            <span>NEO bank</span>
          </div>
          <div class="info">
            <div class="amount">1, 547{{item.ico}}</div>
            <div class="type"><img src="@/assets/images/cloud.svg" alt title></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'CardsList',
    props: ['isCardsDeleting', 'isCardsMoving'],
    data() {
      return {
        trans: [
          {
            code: 'Japanese yen',
            balance: '87.34円',
            ico: '₴',
            isactive: false
          },
          {
            code: 'Russian ruble',
            balance: '25494.11₽',
            ico: '₽',
            isactive: false
          },
          {
            code: 'U.S. dollar',
            balance: ' 1234.70$',
            ico: '$',
            isactive: false
          },
          {
            code: 'European Euro',
            balance: '301.23€',
            ico: '€',
            isactive: false
          },
          {
            code: 'Russian ruble',
            balance: '25494.11₽',
            ico: '₽',
            isactive: false
          },
          {
            code: 'Russian ruble',
            balance: '25494.11₽',
            ico: '₽',
            isactive: false
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        accounts: 'account/CARDS'
      })
    },
    methods: {
      handleDeleteItem(id) {
        console.log(this.accounts);
        console.log(id);
        // this.$store.commit('wallet/DELETE_WALLET', this.wallets.find(wallet => wallet.address === address))
        // this.$store.commit('wallet/SET_WALLETS', this.wallets.filter(wallet => wallet.address !== address))
      },
      handleClick(item) {
        if (isCardsDeleting || isCardsDeleting) {
          return false;
        } else {
          item.isactive = !item.isactive
        }
      }
    }
  }
</script>