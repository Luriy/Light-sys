<template>
  <draggable v-model="draggableWalletsList" v-if="isWalletsMoving" class="wallets-list_item_body" v-bind="dragOptions">
    <div v-for="(wallet, idx) in wallets"
    @click.native.prevent="handleWalletRouter(`/wallets/${wallet.currency}/${wallet.address}`)" class="list__item" :key="wallet.address">
      <div class="btn-remove" v-show="isWalletsDeleting" @click="handleDeleteItem(idx)">
        <img src="@/assets/images/cross.svg" />
      </div>
      <div class="wallet">
        <div class="code">
          <div :class="['image', wallet.currency.toLowerCase()]">
            <img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc-ico.svg" alt title>
            <img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title>
          </div>
          <span>{{ wallet.currency }}</span>
        </div>
        <div class="info">
          <div class="balance">
            <p>{{ wallet.currency }} {{ formatCurrency(wallet.balance, '', 5) }}</p>
            <span>USD {{ formatCurrency(wallet.balanceUSD, '$') }}</span>
          </div>
          <div class="progress green">
            <p>{{ percentage[wallet.currency] | percentage }}</p>
            <div class="image">
              <!-- TODO: Используйте computed свойство percentage для построения графиков -->
              <img src="@/assets/images/graph-green.svg" alt title>
            </div>
          </div>
        </div>
      </div>
    </div>
  </draggable>
  <div v-else class="wallets-list_item_body">
    <router-link event="" v-for="(wallet, idx) in wallets" :to='`/wallets/${wallet.currency}/${wallet.address}`'
    @click.native.prevent="handleWalletRouter(`/wallets/${wallet.currency}/${wallet.address}`)" class="list__item" :key="wallet.address">
      <div class="btn-remove" v-show="isWalletsDeleting" @click="handleDeleteItem(idx)">
        <img src="@/assets/images/cross.svg" />
      </div>
      <div class="wallet">
        <div class="code">
          <div :class="['image', wallet.currency.toLowerCase()]">
            <img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc-ico.svg" alt title>
            <img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title>
          </div>
          <span>{{ wallet.currency }}</span>
        </div>
        <div class="info">
          <div class="balance">
            <p>{{ wallet.currency }} {{ formatCurrency(wallet.balance, '', 5) }}</p>
            <span>USD {{ formatCurrency(wallet.balanceUSD, '$') }}</span>
          </div>
          <div class="progress green">
            <p>{{ percentage[wallet.currency] | percentage }}</p>
            <div class="image">
              <!-- TODO: Используйте computed свойство percentage для построения графиков -->
              <img src="@/assets/images/graph-green.svg" alt title>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'WalletsList',
    props: ['wallets', 'percentage', 'isWalletsDeleting', 'isWalletsMoving'],
    data () {
      return {
        dragOptions: {
          animation: 0,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        }
      }
    },
    components: {
        draggable,
    },
    filters: {
      percentage: value => value ? `${value['1h'].toFixed(2)}%` : '',
    },
    methods: {
      handleWalletRouter(route) {
        if (this.isWalletsDeleting || this.isWalletsMoving) {
          return false;
        }
        else {
          this.$router.push(route);
        }
      },
      handleDeleteItem(id) {
        this.$store.commit('wallet/SET_WALLETS', this.wallets.filter((wallet, index) => index !== id))
      }
    },
    computed: {
      draggableWalletsList: {
        get() {
          return this.wallets;
        },
        set(value) {
          return this.$store.commit('wallet/SET_WALLETS', value)
        }
      }
    }
  }
</script>