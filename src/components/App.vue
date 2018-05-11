<template lang='slm'>
  #app.container
    Scene[
      :level='map'
      :player='map.creatures[0]'
      :pause='pause'
      ]

    .col
      button @click="generateMap()"
        | Generate!

      label radius
      input type="number" v-model="radius"

      button @click="pause = !pause"
        | {{ pause ? 'Start' : 'Pause' }}

      label for='doors'
        input#doors type='checkbox' v-model='addDoors'
        | Add doors
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

import { Chaser, Waiter, Explorer } from '../ai'

export default Vue.extend({
  data() {
    return {
      map: new LevelMap([[]]),
      radius: 10,
      pause: false,
      ts: Date.now(),
      addDoors: true,
    }
  },
  components: {
    Cell,
    Scene
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

      new Walker(
        x,
        y,
        this.radius,
        this.map,
        new Explorer(),
      )

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

      new Walker(
        x,
        y,
        this.radius,
        this.map,
        new Chaser(),
      )
    },
    buildMap() {
      let map = generate(50, 50)

      if (this.addDoors) {
        return addDoors(map)
      }

      return map
    }
  },
  created() {
    this.generateMap()
  },
  watch: {
    addDoors() {
      this.generateMap()
    }
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
