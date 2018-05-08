<template lang='slm'>
  #app
    Scene[
      :scene='map'
      :player='walker'
      ]

    .col
      button @click="generateMap()"
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
import Scene from './Scene.vue'

import { LevelMap } from '../map'
import { Walker } from '../creatures/walker'
import { Memory, MemoryTile } from '../creature'
import { generate } from '../generator/dungeon'
import { addDoors } from '../generator/post'

export default Vue.extend({
  data() {
    return {
      map: new LevelMap([[]]),
      radius: 10,
      player: {
        x: 10,
        y: 10,
      },
      pause: true,
      ts: Date.now(),
    }
  },
  components: {
    Cell,
    Scene
  },
  computed: {
    walker() {
      if (this.map) {
        return new Walker(
          this.player.x,
          this.player.y,
          this.radius,
          this.map,
        )
      }
    }
  },
  methods: {
    generateMap() {
      this.map = this.buildMap()
      let x = 1,
          y = 1

      while (!this.map.visibleThrough(x, y)) {
        if (x < this.map.width - 1) {
          x += 1
        } else {
          x = 1
          y += 1
        }
      }

      this.player = { x, y }

      x = this.map.width - 1
      y = this.map.height -1

      while (!this.map.visibleThrough(x, y)) {
        if (x > 1) {
          x -= 1
        } else {
          x = this.map.width - 1
          y -= 1
        }
      }

      this.map.at(x, y).creature = new Walker(
        x,
        y,
        this.radius,
        this.map,
      )
    },
    updatePlayerPosition(x: number, y: number) {
      this.pause = false;
      this.player.x = x;
      this.player.y = y;
    },
    buildMap() {
      return addDoors(generate(50, 50))
    }
  },
  created() {
    this.generateMap()
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
