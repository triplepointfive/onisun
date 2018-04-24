<template>
  <div id="app">
    <div v-for="row in msg">
      {{ buildRow(row) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { map, Tile } from './grid'

export default Vue.extend({
  data() {
    return {
      msg: map
    }
  },
  methods: {
    buildRow(row: Array<Tile>) {
      return row.map(tile => this.symbol(tile)).join('');
    },
    symbol(tile: Tile) {
      if (tile == ' ') {
        return '.'
      }
      return tile
    }
  }
})
</script>
