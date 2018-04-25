<template>
  <div id="app">
    <div v-for="(row, i) in msg">
      <Cell :cell="cell" v-for="(cell, j) in row"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Cell from './Cell.vue'

import { map, Tile } from './grid'

export default Vue.extend({
  data() {
    return {
      msg: map
    }
  },
  components: {
    Cell
  }
})
</script>
