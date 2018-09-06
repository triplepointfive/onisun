<template lang='pug'>
#app.container-fluid(v-if='game')
  Scene.scene(
    :level='game.currentMap'
    :player='game.player'
    :pos='game.currentMap.creaturePos(game.player)'
    v-if='game.player'
    )

  Stats.player-stats(
    :creature='game.player'
    :level-map='game.currentMap'
    v-if='game.player'
    )

  Logger.logger-panel(
    :logger='game.logger'
    )
  Impacts.effect-panel(
    :impacts='game.player.impacts'
  )

  component(
    v-if='game.ai'
    :is='viewComponent'
    :screen='game.ai.presenter'
    ref="viewComponent"
    )
</template>

<script lang='ts'>
import Vue,{ VueConstructor } from 'vue'
import * as _ from 'lodash'

import Logger from './Logger.vue'
import Scene from './Scene.vue'
import Stats from './Stats.vue'
import Impacts from './Impacts.vue'

import Idle from './views/IdleView.vue'
import ProfessionPickingView from './views/ProfessionPickingView.vue'
import ItemsListingView from './views/ItemsListingView.vue'
import TalentsTreeView from './views/TalentsTreeView.vue'
import InventoryView from './views/InventoryView.vue'
import LookView from './views/LookView.vue'
import MissileView from './views/MissileView.vue'
import DeathView from './views/DeathView.vue'
import PickSingleOptionView from './views/PickSingleOptionView.vue'

import { LevelMap, PresenterType, Presenter } from '../src/engine'

import { Application } from '../src/onisun'
import { setInterval, clearInterval } from 'timers'

export default Vue.extend({
  data() {
    return {
      game: new Application().game,
      ts: Date.now(),
      loopIntervalId: undefined
    }
  },
  components: {
    Impacts,
    Logger,
    Scene,
    Stats,
  },
  computed: {
    viewComponent(): VueConstructor | undefined {
      switch (this.game.ai && this.game.ai.presenter && this.game.ai.presenter.type) {
      case PresenterType.AbilitiesPicking:
        return TalentsTreeView
      case PresenterType.ProfessionPicking:
        return ProfessionPickingView
      case PresenterType.Idle:
        return Idle
      case PresenterType.ItemsListing:
        return ItemsListingView
      case PresenterType.Inventory:
        return InventoryView
      case PresenterType.Missile:
        return MissileView
      case PresenterType.Teleportation:
      case PresenterType.Look:
        // TODO: It's not only look anymore, name accordingly
        return LookView
      case PresenterType.Death:
        return DeathView
      case PresenterType.PickHandleOption:
        return PickSingleOptionView
      default:
        throw `App: unknown presenter ${this.game.ai.presenter}`
      }
    }
  },
  methods: {
    loop() {
      this.game.turn()
    },
    onEvent(event: KeyboardEvent) {
      const view = this.$refs.viewComponent
      if (view) {
        view.onEvent(event)
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
  height: 100%;
  background-color: black;

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

  .effect-panel {
    position: fixed;
    right: 1rem;
    top: 1rem;
  }
}
</style>
