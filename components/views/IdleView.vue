<template lang='pug'>
div
</template>

<script lang='ts'>
import Vue from 'vue'
import { Direction } from '../../src/onisun'

export default Vue.extend({
  name: 'IdleView',
  props: ['screen'],
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key) {
      case 'l':
      case 'ArrowRight':
        return this.screen.move(Direction.right)
      case 'h':
      case 'ArrowLeft':
        return this.screen.move(Direction.left)
      case 'k':
      case 'ArrowUp':
        return this.screen.move(Direction.up)
      case 'j':
      case 'ArrowDown':
        return this.screen.move(Direction.down)
      case 'y':
        return this.screen.move(Direction.upLeft)
      case 'u':
        return this.screen.move(Direction.upRight)
      case 'b':
        return this.screen.move(Direction.downLeft)
      case 'n':
        return this.screen.move(Direction.downRight)

      case 'H':
        return this.screen.handleCommand()
      case 'L':
        return this.screen.lookCommand()

      case 's':
      case '.':
        return this.screen.stayCommand()

      case 'i':
      case '#':
        return this.screen.inventoryCommand()
      case 'I':
        return this.screen.bagCommand()
      case 't':
        return this.screen.missileCommand()
      case ',':
        return this.screen.pickUpCommand()
      case 'd':
        return this.screen.dropCommand()
      case 'D':
        return this.screen.drinkCommand()

      case '@':
        return this.screen.goToBaseInfo()
      case '#':
        return this.screen.goToInventory()
      case '%':
        return this.screen.goToTalents()
      case '&':
        return this.screen.goToHistoryInfo()

      default:
        console.log('Key: ', event.key)
      }
    }
  }
})
</script>
