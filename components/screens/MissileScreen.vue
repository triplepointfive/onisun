<template lang='pug'>
div
</template>

<script lang='ts'>
import Vue from 'vue'
import { IdleInputKey, Direction } from '../../src/engine'

export default Vue.extend({
  name: 'MissileScreen',
  props: ['screen'],
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event) {
      switch (event.key) {
      case 'l':
      case 'ArrowRight':
        return this.screen.moveTarget(Direction.right)
      case 'h':
      case 'ArrowLeft':
        return this.screen.moveTarget(Direction.left)
      case 'k':
      case 'ArrowUp':
        return this.screen.moveTarget(Direction.up)
      case 'j':
      case 'ArrowDown':
        return this.screen.moveTarget(Direction.down)
      case 'y':
        return this.screen.moveTarget(Direction.upLeft)
      case 'u':
        return this.screen.moveTarget(Direction.upRight)
      case 'b':
        return this.screen.moveTarget(Direction.downLeft)
      case 'n':
        return this.screen.moveTarget(Direction.downRight)

      case '>':
        this.screen.nextTarget()
        break
      case '<':
        this.screen.previousTarget()
        break
      case 't':
        this.screen.attack()
        break
      case 'Escape':
        this.screen.close()
        break
      }
    }
  }
})
</script>
