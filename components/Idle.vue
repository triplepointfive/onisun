<template>
  <div></div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { IdleInputKey } from '../src/screen'


const
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40

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
      switch (event.keyCode) {
      case RIGHT_ARROW:
        return this.close(IdleInputKey.Right)
      case LEFT_ARROW:
        return this.close(IdleInputKey.Left)
      case UP_ARROW:
        return this.close(IdleInputKey.Up)
      case DOWN_ARROW:
        return this.close(IdleInputKey.Down)
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
