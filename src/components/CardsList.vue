<template>
  <div class="wallets-list_item_body">
    <div 
      class="wallet fiat-wallet list__item" 
      v-for="(item, idx) in trans"
      :class="{active: item.isactive}" 
      @click="item.isactive = !item.isactive" 
      :key="idx"
     >
      <div class="btn-remove" v-show="isCardsDeleting" @click="handleDeleteItem(idx)">
        <img src="@/assets/images/cross.svg"/>
      </div>
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
  export default {
    name: 'CardsList',
    props: ['trans', 'isCardsDeleting'],
    methods: {
      handleDeleteItem(id) {
        this.$store.commit('wallet/SET_WALLETS', this.wallets.filter((wallet, index) => index !== id))
      }
    }
  }
</script>