<template lang='slm'>
  td[
    :class="style"
    v-text="symbol"
    @click="$emit('setPosition')"
    ]
</template>

<script lang="ts">
import Vue from 'vue'

import { Tile, TileTypes } from '../map'

export default Vue.extend({
  props: ["cell", 'player'],
  computed: {
    style() {
      if (this.player) {
        return 'player'
      } else if (this.cell.type == TileTypes.Wall) {
        return 'wall'
      } else if (this.cell.type == TileTypes.Door) {
        return 'door'
      }

      return 'floor'
    },
    symbol():any {
      if (this.player) {
        return '俺'
      } else if (this.cell.display == ' ') {
        return '・'
      } else if (this.cell.display == '+') {
        return '戸'
      } else if (this.cell.display == '#') {
        return '＃'
      } else {
        return 'E'
      }
    }
  }
})
</script>

<style>
.player {
  color: white;
  background-color: black;
}
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
