<template>
  <div></div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { IdleInputKey } from '../src/screen'

export default Vue.extend({
  name: 'Idle',
  props: ['screen'],
  data() {
    return {
    }
  },
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event) {
      switch (event.key) {
      case 'l':
      case 'ArrowRight':
        return this.close(IdleInputKey.Right)

      case 'h':
      case 'ArrowLeft':
        return this.close(IdleInputKey.Left)

      case 'k':
      case 'ArrowUp':
        return this.close(IdleInputKey.Up)

      case 'j':
      case 'ArrowDown':
        return this.close(IdleInputKey.Down)

      case 'y':
        return this.close(IdleInputKey.UpLeft)
      case 'u':
        return this.close(IdleInputKey.UpRight)
      case 'b':
        return this.close(IdleInputKey.DownLeft)
      case 'n':
        return this.close(IdleInputKey.DownRight)

      case 'H':
        return this.close(IdleInputKey.Handle)
      }
    }
  },
  created() {
    document.addEventListener('keydown', this.onEvent)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onEvent)
  }
})
</script>
