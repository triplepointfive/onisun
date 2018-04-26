<template>
  <span :class="style" v-text="symbol">
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import { map, Tile } from './grid'

export default Vue.extend({
  props: ["cell"],
  computed: {
    style() {
      if (this.cell == '#') {
        return 'wall'
      }
    },
    symbol() {
      if (this.cell == ' ') {
        return '　'
      } if (this.cell == '+') {
        return '＋'
      } else {
        return '＃'
      }
    }
  }
})
</script>

<style>
.wall {
  color: lightgrey;
  background-color: lightgrey;
}
</style>
