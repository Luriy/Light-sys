<template>
  <lk-layout>
    <i class="fas fa-ad"></i>
    <div class="select-header d-flex flex-row">
      <v-select
        :items="[1,3,4,5]"
        label="Choose option"
        color="#F44336"
        background-color="#3b2665"
        solo
      ></v-select>
      <v-select
        :items="[1,3,4,5]"
        label="Choose Second"
        color="#F44336"
        background-color="#3b2665"
        solo
      ></v-select>
    </div>
  </lk-layout>
</template>

<script>
  import LkLayout from '@/layout/LkLayout'

    export default {
        name: 'SmartContract',
      components: { LkLayout }
    }
</script>

<style scoped lang="scss">
  @import "../assets/scss/common";
</style>
