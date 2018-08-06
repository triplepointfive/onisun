<template>
  <div></div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { IdleInputKey } from '../../src/engine'

export default Vue.extend({
  name: 'IdleScreen',
  props: ['screen'],
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

      case 'i':
        return this.close(IdleInputKey.Inventory)
      case ',':
        return this.close(IdleInputKey.PickUp)
      case 'd':
        return this.close(IdleInputKey.Drop)
      case 'D':
        return this.close(IdleInputKey.Drink)
      }
    }
  }
})
</script>
