<template>
  <div id='app' class='container'>
    <Scene :level='map' v-if='map.creatures.length'/>
    <Logger :logger='map.logger' />
    <div class=''>
      <div class=''>
        <div class='form-group row'>
          <label class='col-sm-2 col-form-label' for='radius'>
            Radius
          </label>
          <div class='col-sm-10'>
            <input class='form-control' id='radius' type='number' v-model='radius'/>
          </div>
        </div>
        <div class='form-group row'>
          <div class='col-sm-2'>
            Map
          </div>
          <div class='col-sm-10'>
            <div class='form-check'>
              <input class='form-check-input' id='doors' type='checkbox' v-model='generatorOptions.addDoors'/>
              <label class='form-check-label' for='doors'>
                Add doors
              </label>
            </div>

            <div class='form-group'>
              <input class='form-control' id='roomsCount' v-model='generatorOptions.roomsCount' type='number'/>
              <label class='form-check-label' for='roomsCount'>
                roomsCount
              </label>
            </div>

            <div class='form-group'>
              <input class='form-control' id='minSize' v-model='generatorOptions.minSize' type='number'/>
              <label class='form-check-label' for='minSize'>
                minSize
              </label>
            </div>

            <div class='form-group'>
              <input class='form-control' id='maxSize' v-model='generatorOptions.maxSize' type='number'/>
              <label class='form-check-label' for='maxSize'>
                maxSize
              </label>
            </div>
          </div>
        </div>
        <div class='form-group row'>
          <div class='col-sm-10'>
            <button class='btn btn-primary' @click="generateMap()">
              Rebuild!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import * as _ from 'lodash'

import Cell from './Cell.vue'
import Logger from './Logger.vue'
import Scene from './Scene.vue'

import {
  LevelMap,
  generateMap,
} from '../src/onisun'

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
    Logger,
    Scene,
  },
  methods: {
    generateMap() {
      this.map = generateMap(
        this.generatorOptions,
        this.radius,
      )
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
