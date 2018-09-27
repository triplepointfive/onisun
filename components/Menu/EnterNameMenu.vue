<template lang="pug">
.content
  .subtitle What's your name: {{ name }}
  .menu-options
    MenuOption(char='Enter' name='Done' v-if='ready')
    MenuOption(char='=' name='Back')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

export default Vue.extend({
  name: 'EnterNameMenu',
  props: ['menu'],
  data() {
    return {
      name: ''
    }
  },
  components: {
    MenuOption
  },
  computed: {
    ready(): boolean {
      return this.name.length > 0
    }
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key) {
        case 'Backspace':
          this.name = this.name.slice(0, -1)
          return
        case 'Enter':
          if (this.ready) {
            this.menu.withName(this.name)
          }
          return
        case '=':
          return this.menu.back()
        default:
          if (event.key.length === 1 && this.name.length < this.menu.maxLength) {
            this.name = this.name.concat(event.key)
          }
      }
    }
  }
})
</script>
