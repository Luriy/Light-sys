<template>
  <lk-layout>
    <div class="wallets-list">
      <div class="wallets-block wallets-list_item"> 
        <div class="toggler">
          <p>Wallets</p>
          <div class="flex toggler__panel">
            <div class="toggle none" :class="{ active: isWalletsMoving }" @click="handleMoving('wallets')">
              <img src="@/assets/images/arrows.svg" width="15" height="15" fill="#fff" />
            </div>
            <div class="toggle minus" :class="{ active: isWalletsDeleting }" @click="handleDeleting('wallets')"></div>
            <router-link to="/wallets/create-wallet"><div class="toggle"></div></router-link>
          </div>
        </div>
        <wallets-list :isWalletsMoving="isWalletsMoving" :isWalletsDeleting="isWalletsDeleting"></wallets-list>
      </div>

      <div class="fiat-block wallets-list_item">
        <div class="toggler">
          <p>Account and Cards</p>
          <div class="flex toggler_panel">
            <div class="toggle none" :class="{ active: isCardsMoving }" @click="handleMoving('cards')">
              <img src="@/assets/images/arrows.svg" width="15" height="15" fill="#fff" />
            </div>
            <div class="toggle minus" :class="{ active: isCardsDeleting }" @click="handleDeleting('cards')"></div>
            <router-link to="/wallets/accounts-and-cards"><div class="toggle"></div></router-link>
          </div>
        </div>
        <cards-list :isCardsDeleting="isCardsDeleting" :isCardsMoving="isCardsMoving" :trans="trans"></cards-list>
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
import { mapGetters } from 'vuex';
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
      isWalletsDeleting: false,
      isWalletsMoving: false,
      isCardsDeleting: false,
      isCardsMoving: false,
    }
  },
  computed: {
    ...mapGetters({
      operations: ['wallet/OPERATIONS']
    }),
  },
  async mounted() {
    this.$store.dispatch('wallet/GET_TYPES');
    if (!localStorage.getItem('stateWalletsWallets')) {
      await this.$store.dispatch('wallet/GET_WALLETS');
    }
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
          return this.isCardsMoving = !this.isCardsMoving;
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
