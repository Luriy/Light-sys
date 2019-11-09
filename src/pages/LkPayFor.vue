<template>
  <lk-layout>
    <payments-and-transfer>
      Pay for
    </payments-and-transfer>
  </lk-layout>
</template>
<style>

</style>
<script>
  import LkLayout from '@/layout/LkLayout'
  import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer'

  export default {
    name: 'LkPayFor',
    components: {
      PaymentsAndTransfer,
      LkLayout
    },
  }
</script>