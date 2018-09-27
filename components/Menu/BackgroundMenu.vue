<template lang="pug">
.content
  .subtitle Background

  PlayerBackground(:player='menu.player')

  .menu-options
    MenuOption(char='N' name='Next')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'
import PlayerBackground from '../PlayerBackground.vue'

export default Vue.extend({
  name: 'HistoryMenu',
  props: ['menu'],
  components: {
    MenuOption,
    PlayerBackground
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key.toUpperCase()) {
      case 'N':
        return this.menu.next()
      }
    }
  }
})
</script>
