<template>
  <span :class="style" v-text="symbol">
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import { Tile, TileTypes } from './grid'

export default Vue.extend({
  props: ["cell"],
  computed: {
    style() {
      if (this.cell.type == TileTypes.Wall) {
        return 'wall'
      }
    },
    symbol():any {
      if (this.cell.display == ' ') {
        return '　'
      } if (this.cell.display == '+') {
        return '戸'
      } if (this.cell.display == '#') {
        return '＃'
      } else {
        return 'E'
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
