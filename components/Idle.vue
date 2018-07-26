<template>
  <div></div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Idle',
  props: ['screen'],
  data() {
    return {
    }
  },
  methods: {
    close(keyCode) {
      this.screen.onInput()
    },
    onEvent(event) {
      this.close(event.keyCode)
    }
  },
  created() {
    document.addEventListener('keypress', this.onEvent)
  },
  beforeDestroy() {
    document.removeEventListener('keypress', this.onEvent)
  }
})
</script>
