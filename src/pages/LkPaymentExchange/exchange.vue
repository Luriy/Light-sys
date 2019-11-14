<template>
  <lk-layout>
    <v-btn :color="isExchange ? '#513685': 'transparent'"
           class="base-exchange"
           :class="{active: isExchange}"
           :depressed="isExchange"
           :text="!isExchange"
           @click="isExchange = true"
    >
      Exchange
    </v-btn>

    <v-btn
      :color="!isExchange ? '#513685': 'transparent'"
      class="base-exchange fiat-exchange"
      :class="{active: !isExchange}"
      :depressed="!isExchange"
      :text="isExchange"
      @click="isExchange = false"
    >
      Buy/Sell Fiat
    </v-btn>

    <div class="exchange-block">
      <crypto v-if="isExchange"></crypto>
      <fiat v-else></fiat>
    </div>
  </lk-layout>
</template>

<script>
  import LkLayout from '@/layout/LkLayout'
  import Crypto from './crypto'
  import Fiat from './fiat'

  export default {
    name: "exchange",
    data() {
      return {
        isExchange: true
      }
    },
    components: {
      LkLayout,
      Crypto,
      Fiat
    },
  }
</script>

<style scoped lang="scss">
  .base-exchange {
    width: 114px;
    text-transform: capitalize;
    color: #ffffff;
    opacity: 0.3;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;

    &.v-btn {
      height: 37px;
    }
  }
  .fiat-exchange {
    width: 130px;
  }
  .active {
    opacity: 1;
  }
</style>
