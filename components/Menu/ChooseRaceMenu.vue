<template lang="pug">
.content
  .subtitle You are {{menu.gender}}. Choose a race:
  .menu-options
    MenuOption(char='H' name='Human')
    MenuOption(char='D' name='Dwarf')
    MenuOption(char='*' name='Random' :separator='true')
    MenuOption(char='=' name='Back' :separator='true')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

import { Gender, dwarfRace, humanRace } from 'src/onisun'

export default Vue.extend({
  name: 'ChooseRaceMenu',
  props: ['menu'],
  components: {
    MenuOption
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key.toUpperCase()) {
      case 'H':
        return this.menu.withRace(humanRace)
      case 'D':
        return this.menu.withRace(dwarfRace)
      case '*':
        return this.menu.random()
      case '=':
        return this.menu.back()
      }
    }
  }
})
</script>
