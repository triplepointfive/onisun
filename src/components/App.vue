<template lang='slm'>
  #app
    .col
      table.game-table
        tr.row v-for="(_, i) in map.height"
          Cell[
            :cell="map.at(j, i)"
            v-for="(_, j) in map.width"
            :key="i + '-' + j"
            :style='visibility(i, j)'
            :player="walker.x == j && walker.y == i"
            @setPosition="updatePlayerPosition(j, i)"
            ]

      button @click="map = buildMap()"
        | Generate!

      label radius
      input type="number" v-model="radius"

      button @click="pause = !pause"
        | {{ pause ? 'Start' : 'Pause' }}
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import * as _ from 'lodash'

import Cell from './Cell.vue'

import { Visibility, Fov } from '../fov'
import { LevelMap } from '../map'
import { Walker, Memory, MemoryTile } from '../creatures/walker'
import { generate } from '../generator/dungeon'
import { addDoors } from '../generator/post'

export default Vue.extend({
  data() {
    return {
      map: new LevelMap([[]]),
      radius: 10,
      player: {
        x: 1,
        y: 1,
      },
      pause: true,
      ts: Date.now(),
    }
  },
  components: {
    Cell
  },
  computed: {
    walker() {
      if (this.map) {
        return new Walker(
          this.player.x,
          this.player.y,
          this.radius,
          this.map.width,
          this.map.height,
        )
      }
    },
    fov(): MemoryTile[][] {
      if (this.ts && this.map) {
        return this.walker.stageMemory.field
      }

      return []
    }
  },
  methods: {
    updatePlayerPosition(x: number, y: number) {
      this.pause = false;
      this.player.x = x;
      this.player.y = y;
    },
    buildMap() {
      let map = addDoors(generate(50, 50))

      clearInterval(this.walkerinterval)
      this.walkerinterval = setInterval(() => {
        if (this.pause) {
          return
        }

        try {
          if (this.walker) {
            this.walker.act(this.map)
            this.ts = Date.now()
            // this.pause = true
            // this.player.x = this.walker.x
            // this.player.y = this.walker.y
          }
        } catch (e) {
          console.error(e)
          this.pause = true
        }

      }, 100);

      return map
    },
    visibility(i: number, j: number) {
      if (this.pause) {
        return { background: 'black', color: 'darkgrey', opacity: 0.3 }
      }

      if (this.fov.length) {
        if (this.fov[i][j].visible) {
          return { opacity: this.fov[i][j].degree }
        } else if (this.fov[i][j].seen) {
          return { background: 'black', color: 'darkgrey', opacity: 0.3 }
        } else {
          return { background: 'black', color: 'black' }
        }
      } else {
        return { background: 'black', color: 'darkgrey' }
      }
    }
  },
  created() {
    this.map = this.buildMap()
  }
})
</script>

<style lang='scss'>
.game-table {
  border-collapse: collapse;
  background-color: black;

  td {
    padding: 0px;
    width: 1em;
    height: 0.1em;
  }
}

.col {
  float: left;
  margin-right: 1em;
}
.block {
  margin-bottom: 1em;

  .wrapper {
    .content {
      border: solid 1px black;
      display: inline-block;
    }
  }
}
.row {
  white-space: nowrap;
}
</style>
