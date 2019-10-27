<template>
  <lk-layout>
    <div class="wallets-list">
      <div class="wallets-block wallets-list_item">
        <div class="toggler">
          <p>Wallets</p>
          <router-link to="/wallets/create-wallet"><div class="toggle"></div></router-link>
        </div>
        <div class="wallets-list_item_body">
          <router-link :to='`/wallets/${wallet.currency}/${wallet.address}`' v-for="wallet in wallets" :key="wallet.address">
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
      </div>

      <div class="fiat-block wallets-list_item">
        <div class="toggler">
          <p>Account and Cards</p>
          <router-link to="/wallets/accounts-and-cards"><div class="toggle"></div></router-link>
        </div>
        <div class="wallets-list_item_body">
          <div class="wallet fiat-wallet" :class="{active: item.isactive}" @click="item.isactive = !item.isactive" v-for="(item, idx) in trans" :key="idx">
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
      </div>
    </div>

    <div class="operations-history">
      <div class="title">
        <p>Operations history</p>
        <span>Sep 09, 2019</span>
      </div>

      <div class="operations-history-list">
        <operations-history-list-item v-for="(operation, idx) in operations" :key="idx" v-bind="operation"></operations-history-list-item>
      </div>
    </div>
  </lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import OperationsHistoryListItem from '@/components/OperationsHistoryListItem';

export default {
  name: 'LkPaymentWallets',
  components: {
    LkLayout,
    OperationsHistoryListItem,
  },
  data() {
    return {
      trans: [
        {
          code: 'Japanese yen',
          balance: '87.34円',
          ico: '円',
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
      ]
    }
  },
  computed: {
    ...mapGetters({
      wallets: 'wallet/WALLETS',
      operations: 'wallet/OPERATIONS',
      percentage: 'wallet/PERCENTAGE',
    })
  },
  async mounted() {
    this.$store.dispatch('wallet/GET_TYPES');
    await this.$store.dispatch('wallet/GET_WALLETS');
    this.$store.dispatch('wallet/GET_OPERATIONS');
  },
  filters: {
    percentage: value => value ? `${value['1h'].toFixed(2)}%` : '',
  },
  methods: {
    copyToClipboard() {
      var elem = document.getElementById("wallet");
      var targetId = "_hiddenCopyText_";
      var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
      var origSelectionStart, origSelectionEnd;

      if (isInput) {
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
      } else {
        target = document.getElementById(targetId);

        if (!target) {
          var target = document.createElement("textarea");
          target.style.position = "absolute";
          target.style.left = "-9999px";
          target.style.top = "0";
          target.id = targetId;
          document.body.appendChild(target);
        }

        target.textContent = elem.textContent;
      }

      var currentFocus = document.activeElement;
      target.focus();
      target.setSelectionRange(0, target.value.length);

      var succeed;
      try {
        succeed = document.execCommand("copy");
        this.wallet = 'Copied to clipboard';
      } catch(e) {
        succeed = false;
      }
      if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
      }

      if (isInput) {
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
      } else {
        target.textContent = "";
      }
      return succeed;
    }
  },
}
</script>
