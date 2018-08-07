<template>
  <div id='app' class='container' v-if='game'>
    <Scene :level='game.currentMap' :player='game.player' v-if='game.player && !game.player.dead'/>

    <div v-if='game.player && game.player.dead'>You are dead</div>

    <component
      v-if='game.screen'
      :is='screenComponent'
      :screen='game.screen'
      ref="screenComponent"
      />

    <Logger :logger='game.logger' />
    <div class=''>
      <div class=''>
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

import Idle from './screens/IdleScreen.vue'
import ProfessionPickingScreen from './screens/ProfessionPickingScreen.vue'
import ItemsListingScreen from './screens/ItemsListingScreen.vue'
import TalentsTreeScreen from './screens/TalentsTreeScreen.vue'
import InventoryScreen from './screens/InventoryScreen.vue'
import MissileScreen from './screens/MissileScreen.vue'

import { LevelMap, ScreenType, Screen } from '../src/engine'

import {
  Onisun,
  baseConfig,
} from '../src/onisun'
import { setInterval, clearInterval } from 'timers';

export default Vue.extend({
  data() {
    return {
      game: new Onisun(baseConfig),
      ts: Date.now(),
      generatorOptions: baseConfig,
      loopIntervalId: undefined
    }
  },
  components: {
    Cell,
    Logger,
    Scene,
  },
  computed: {
    screenComponent() {
      switch (this.game.screen && this.game.screen.type) {
      case ScreenType.AbilitiesPicking:
        return TalentsTreeScreen
      case ScreenType.ProfessionPicking:
        return ProfessionPickingScreen
      case ScreenType.Idle:
        return Idle
      case ScreenType.ItemsListing:
        return ItemsListingScreen
      case ScreenType.Inventory:
        return InventoryScreen
      case ScreenType.Missile:
        return MissileScreen
      }
    }
  },
  methods: {
    generateMap() {
      this.game = new Onisun(
        this.generatorOptions,
      )
    },
    loop() {
      this.game.turn()
    },
    onEvent(event) {
      const screen = this.$refs.screenComponent
      if (screen) {
        screen.onEvent(event)
      }
    }
  },
  created() {
    this.loopIntervalId = setInterval(this.loop, 10)
    document.addEventListener('keydown', this.onEvent)
  },
  beforeDestroy() {
    clearInterval(this.loopIntervalId)
    document.removeEventListener('keydown', this.onEvent)
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
