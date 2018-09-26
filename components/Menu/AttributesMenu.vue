<template lang="pug">
.content
  .subtitle You are {{ menu.gender }} {{ menu.race.name }}. Choose your attributes:
  .menu-options
    MenuOption(char='*' name='Random')
    MenuOption(char='M' name='Manually')
    MenuOption(char='=' name='Back' :separator='true')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

export default Vue.extend({
  name: 'AttributesMenu',
  props: ['menu'],
  components: {
    MenuOption
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key.toUpperCase()) {
      case 'M':
        return this.menu.manually()
      case '=':
        return this.menu.back()
      }
    }
  }
})
</script>
