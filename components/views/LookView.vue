<template lang='pug'>
.look-modal
  .title(v-text='title')
  div(v-for="msg in screen.body" v-text='msg')
</template>

<script lang='ts'>
import Vue from 'vue'
import { Direction, LookPresenterVisibility } from '../../src/engine'

export default Vue.extend({
  name: 'LookView',
  props: ['screen'],
  computed: {
    title() {
      switch (this.screen.title) {
      case LookPresenterVisibility.See:
        return 'Вижу ...'
      case LookPresenterVisibility.Recall:
        return 'Вспоминаю ...'
      case LookPresenterVisibility.Hidden:
        return 'Без понятия ...'
      default:
        return this.screen.title
      }
    }
  },
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event: KeyboardEvent) {
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

      case 'Escape':
      case ' ':
        this.screen.close()
        break
      }
    }
  }
})
</script>

<style lang='scss' scoped>
.look-modal {
  position: fixed;
  top: 0;
  left: 0;

  background-color: black;
  border: 2px solid gold;
  padding: 1rem;
  z-index: 3;

  color: white;

  .title {
    color: gold;
    text-align: center;
  }
}
</style>
