<template>
  <div class="popup-body" tabindex="0" ref="popup" @click="closeDialog" @keyup.esc="closeDialog">
    <div class="popup-wrapper" :style="popupSize" tabindex="1" @click.stop>
      <slot name='title'/>
      <slot name='smsNumber'></slot>
      <slot name='body'/>
      <slot name='buttons'/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LkPopUp',
  props: {
    popupSize: {
      type: Object,
      default: ()=>({
        width: '597px',
        height: '500px'
      })
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeModal', false);
    }
  }
}
</script>

<style>
  
</style>
