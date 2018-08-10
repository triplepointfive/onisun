<template>
  <div id='app' class='container-fluid' v-if='game'>
    <Scene class='scene' :level='game.currentMap' :player='game.player' v-if='game.player && !game.player.dead'/>

    <Stats class='player-stats' :creature='game.player' v-if='game.player && !game.player.dead'/>
    <Logger class='logger-panel' :logger='game.logger' />

    <div v-if='game.player && game.player.dead'>You are dead</div>

    <component
      v-if='game.screen'
      :is='screenComponent'
      :screen='game.screen'
      ref="screenComponent"
      />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import * as _ from 'lodash'

import Cell from './Cell.vue'
import Logger from './Logger.vue'
import Scene from './Scene.vue'
import Stats from './stats.vue'

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
    Stats,
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

#app {
  padding: 0;

  .player-stats {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
  }

  .logger-panel {
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
