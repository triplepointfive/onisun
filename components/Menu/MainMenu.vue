<template lang="pug">
.content
  .menu-options
    MenuOption(char='N' name='New game')
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
        return this.menu.newGame()
      }
    }
  }
})
</script>
