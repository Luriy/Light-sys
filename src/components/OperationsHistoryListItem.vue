<template>
  <div :class="{
    'operations-history-list-item': true,
    'plus-trans': isReceived }">
    <div class="left">
      <div class="type">
        <img v-if="isReceived" src="@/assets/images/path-green.svg" lat title>
        <img v-else src="@/assets/images/path-red.svg" lat title>
      </div>
      <div class="status">
        <p>{{ isReceived ? 'Received' : 'Send' }}</p>
        <span>{{ time | formatAMPM }}</span>
      </div>
    </div>
    <div class="code">
      <template v-if="currency === 'BTC'">
        <img src="@/assets/images/btc.png" alt title>
        <span class="btc">Bitcoin</span>
      </template>
      <template v-if="currency === 'ETH'">
        <img src="@/assets/images/eth.png" alt title>
        <span class="eth">Ethereum</span>
      </template>
      <template v-if="currency === 'NEO Bank'">
        <img src="@/assets/images/lightnet.png" alt title>
        <span class="eth">NEO Bank</span>
      </template>
    </div>
    <div class="address">{{ address }}</div>
    <div class="amount">
      <p>{{ formatCurrency(value, '', 5) }} {{ currency }}</p>
      <span>{{ formatCurrency(valueUSD, '$') }} USD</span>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatAMPM: date => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
  },
  computed: {
    isReceived() {
      return this.value >= 0;
    }
  },
  created() {
    // console.log(this.currency);
  },
  props: [
    'time',
    'currency',
    'address',
    'url',
    'value',
    'valueUSD'
  ],
}
</script>
