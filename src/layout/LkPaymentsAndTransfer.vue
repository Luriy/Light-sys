<template>
  <lk-layout>
    <div class="tabs-bar">
      <button class="tab" v-for="link in links" :to="link.to" :class="{ active: link.name === activeTab}" @click="handleClickTab(link.name, link.to)">
        {{ link.name }}
      </button>
    </div>
    <slot></slot>
  </lk-layout>
</template>
<style scoped>
  .tabs-bar {
    display: flex;
  }
  .tab {
    padding: 10px 15px;
    margin-right: 10px;
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
  }
  .tab:last-of-type {
    margin-right: 0;
  }
  .tab.active {
    background-color: #513685; 
  }
</style>
<script>
  import LkLayout from '@/layout/LkLayout'

  export default {
    name: 'LkPaymentsAndTransfers',
    components: {
      LkLayout,
    },
    data() {
      return {
        activeTab: 'Pay for',
        links: [
          {
            name: 'Transfer',
            to: 'payments-and-transfer/transfer/send/BTC/',
          },
          {
            name: 'Pay for',
            to: '/pay-for',
          },
        ]
      }
    },
    methods: {
      handleClickTab(name, route) {
        this.activeTab = name;
        this.$router.push(route);
      }
    }
  }
</script>