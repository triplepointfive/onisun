<template lang="pug">
.content
  .subtitle Choose a gender:
  .menu-options
    MenuOption(char='M' name='Male')
    MenuOption(char='F' name='Female')
    MenuOption(char='*' name='Random' :separator='true')
    MenuOption(char='=' name='Back' :separator='true')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

import { Gender } from 'src/onisun'

export default Vue.extend({
  name: 'ChooseGenderMenu',
  props: ['menu'],
  components: {
    MenuOption
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key.toUpperCase()) {
      case 'M':
        return this.menu.withGender(Gender.Male)
      case 'F':
        return this.menu.withGender(Gender.Female)
      case '*':
        return this.menu.random()
      case '=':
        return this.menu.back()
      }
    }
  }
})
</script>
