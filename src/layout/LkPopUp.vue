<template>
  <div class="popup-body">
    <div class="popup-wrapper">
      <slot name='title'/>
      <slot name='body'/>
      <slot name='buttons'/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LkPopUp'
}
</script>

<style scoped>

</style>
