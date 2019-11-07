<template>
  <lk-layout>
    <div class="wallets-list">
      <div class="wallets-block wallets-list_item"> 
        <div class="toggler">
          <p>Wallets</p>
          <div class="flex">
            <div class="toggle none" @click="handleMoving('wallets')">
              <img src="@/assets/images/arrows.svg" width="15" height="15" fill="#fff" />
            </div>
            <div class="toggle minus" @click="handleDeleting('wallets')"></div>
            <router-link to="/wallets/create-wallet"><div class="toggle"></div></router-link>
          </div>
        </div>
        <wallets-list :isWalletsMoving="isWalletsMoving" :percentage="percentage" :wallets="wallets" :isWalletsDeleting="isWalletsDeleting"></wallets-list>
      </div>

      <div class="fiat-block wallets-list_item">
        <div class="toggler">
          <p>Account and Cards</p>
          <div class="flex">
            <div class="toggle minus" @click="handleDeleting('cards')"></div>
            <router-link to="/wallets/accounts-and-cards"><div class="toggle"></div></router-link>
          </div>
        </div>
        <cards-list @delete-item="" :isCardsDeleting="isCardsDeleting" :trans="trans"></cards-list>
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
<style scoped>
  .minus {
    margin-right: 5px;
  }
  .toggler {
    padding-right: 1.7vw;
  }
</style>
<script>
import { mapGetters, mapMutations } from 'vuex';
import wallet from '@/store/modules/wallet';
import LkLayout from '@/layout/LkLayout';
import OperationsHistoryListItem from '@/components/OperationsHistoryListItem';
import WalletsList from '@/components/WalletsList';
import CardsList from '@/components/CardsList';

export default {
  name: 'LkPaymentWallets',
  components: {
    LkLayout,
    OperationsHistoryListItem,
    WalletsList,
    CardsList,
  },
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
      isWalletsDeleting: false,
      isWalletsMoving: false,
      isCardsDeleting: false,
    }
  },
  computed: {
    ...mapGetters({
      wallets: 'wallet/WALLETS',
      operations: 'wallet/OPERATIONS',
      percentage: 'wallet/PERCENTAGE',
    }),
  },
  async mounted() {
    this.$store.dispatch('wallet/GET_TYPES');
    await this.$store.dispatch('wallet/GET_WALLETS');
    this.$store.dispatch('wallet/GET_OPERATIONS');
  },
  methods: {
    handleDeleting(type) {
      switch(type) {
        case 'cards':
          return this.isCardsDeleting = !this.isCardsDeleting;
        case 'wallets':
          return this.isWalletsDeleting = !this.isWalletsDeleting;
      }
    },
    handleMoving(type) {
      switch(type) {
        case 'cards':
          return this.isCardsDeleting = !this.isCardsDeleting;
        case 'wallets':
          return this.isWalletsMoving = !this.isWalletsMoving;
      }
    },
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
