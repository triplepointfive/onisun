<template lang='slm'>
  #app.container
    Scene[
      :level='map'
      :player='map.creatures[0]'
      ]

    .row
      .col-md-6.mt-2
        .form-group.row
          label.col-sm-2.col-form-label for='radius' Radius
          .col-sm-10
            input.form-control#radius type='number' v-model='radius'

        .form-group.row
          .col-sm-2 Map
          .col-sm-10
            .form-check
              input.form-check-input#doors type='checkbox' v-model='generatorOptions.addDoors'
              label.form-check-label for='doors'
                | Add doors

            .form-group
              input.form-control#roomsCount v-model='generatorOptions.roomsCount' type='number'
              label.form-check-label for='roomsCount'
                | roomsCount

            .form-group
              input.form-control#minSize v-model='generatorOptions.minSize' type='number'
              label.form-check-label for='minSize'
                | minSize

            .form-group
              input.form-control#maxSize v-model='generatorOptions.maxSize' type='number'
              label.form-check-label for='maxSize'
                | maxSize

        .form-group.row
          .col-sm-10
            button.btn.btn-primary @click="generateMap()"
              | Rebuild!
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import * as _ from 'lodash'

import Cell from './Cell.vue'
import Scene from './Scene.vue'

import { LevelMap } from '../map'
import { Creature } from '../creature'
import { Memory, MemoryTile } from '../creature'
import { generate } from '../generator/dungeon'
import { addDoors } from '../generator/post'

import { Katana } from '../items'

import { Escaper, Chaser, Waiter, Explorer } from '../ai'

export default Vue.extend({
  data() {
    return {
      map: new LevelMap([[]]),
      radius: 10,
      ts: Date.now(),
      generatorOptions: {
        addDoors: false,
        minSize: 5,
        maxSize: 5,
        roomsCount: 3,
      }
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

      new Creature(
        x + 2,
        y + 2,
        this.radius,
        this.map,
        new Escaper(),
      )

      new Creature(
        x,
        y,
        this.radius,
        this.map,
        new Chaser(),
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

      // new Creature(
      //   x - 1,
      //   y - 1,
      //   this.radius,
      //   this.map,
      //   new Explorer(),
      // )

      // new Creature(
      //   x,
      //   y,
      //   this.radius,
      //   this.map,
      //   new Chaser(),
      // )
    },
    buildMap() {
      let map = generate(
        50,
        50,
        this.generatorOptions.minSize,
        this.generatorOptions.maxSize,
        this.generatorOptions.roomsCount,
      )

      if (this.generatorOptions.addDoors) {
        return addDoors(map)
      }

      map.at(3, 3).item = new Katana()

      return map
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
