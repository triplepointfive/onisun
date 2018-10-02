<template lang="pug">
.content
  .menu-options
    MenuOption(char='N' name='New game' @click='newGame()')
    MenuOption(char='T' name='Tutorial')
    MenuOption(char='R' name='Random challenge' @click='random()')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

export default Vue.extend({
  name: 'MainMenu',
  props: ['menu'],
  components: {
    MenuOption
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key.toUpperCase()) {
      case 'N':
        return this.newGame()
      case 'R':
        return this.random()
      }
    },
    newGame(): void {
      this.menu.newGame()
    },
    random(): void {
      this.menu.randomPlayer()
    }
  }
})
</script>
