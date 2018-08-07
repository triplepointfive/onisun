<template>
  <div>MissileScreen</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { IdleInputKey } from '../../src/engine'

export default Vue.extend({
  name: 'MissileScreen',
  props: ['screen'],
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event) {
      switch (event.key) {
      case '>':
        this.screen.nextTarget()
        break
      case '<':
        this.screen.previousTarget()
        break
      case 'T':
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
