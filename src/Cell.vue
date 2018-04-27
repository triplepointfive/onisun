<template lang='slm'>
  td :class="style" v-text="symbol"
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
      } else if (this.cell.type == TileTypes.Door) {
        return 'door'
      }

      return 'floor'
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
  color: orange;
  background-color: orange;
}
.floor {
  color: orange;
  background-color: black;
}
.door {
  color: black;
  background-color: orange;
}
</style>
