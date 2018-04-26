<template>
  <span :style="style" v-text="symbol()">
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import { map, Tile } from './grid'

export default Vue.extend({
  props: ["cell"],
  methods: {
    style() {
      return {}
    },
    symbol() {
      if (this.cell == ' ') {
        return '　'
      } if (this.cell == '+') {
        return '　'
      } else {
        return '＃'
      }
    }
  }
})
</script>
