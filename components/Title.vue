<template lang='pug'>
#app
  Scene(
    :level='game.currentMap'
    :player='game.player'
    :pos='pos'
    v-if='game'
    )

  .title-view.screen-modal
    pre.title
      |  ██████╗ ███╗   ██╗██╗███████╗██╗   ██╗███╗   ██╗
      | ██╔═══██╗████╗  ██║██║██╔════╝██║   ██║████╗  ██║
      | ██║   ██║██╔██╗ ██║██║███████╗██║   ██║██╔██╗ ██║
      | ██║   ██║██║╚██╗██║██║╚════██║██║   ██║██║╚██╗██║
      | ╚██████╔╝██║ ╚████║██║███████║╚██████╔╝██║ ╚████║
      |  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝

    component(
      :is='menuPage'
      :menu='app.menu'
      ref='menuComponent'
    )
</template>

<script lang='ts'>
import Vue,{ Component } from 'vue'

import ChooseRacePage from './Menu/ChooseRaceMenu.vue'
import ChooseGenderPage from './Menu/ChooseGenderMenu.vue'
import MainMenuPage from './Menu/MainMenu.vue'
import AttributesPage from './Menu/AttributesMenu.vue'
import AttributesSelectionPage from './Menu/AttributesSelectionMenu.vue'

import {
  Application,
  Point,
  TitleGame,
  Gender,
  Race,
  humanRace,
  MainMenu,
  MenuComponent
} from '../src/onisun'

import Scene from './Scene.vue'

const LOOP_INTERVAL = 100

export default Vue.extend({
  name: 'Title',
  data() {
    const app = new Application()
    return {
      app: app,
      game: app.titleGame() as TitleGame,
      loopIntervalId: undefined as number | undefined
    }
  },
  computed: {
    menuPage(): Component {
      switch (this.app.menu.component) {
        case MenuComponent.MainMenu:
          return MainMenuPage
        case MenuComponent.ChooseGenderMenu:
          return ChooseGenderPage
        case MenuComponent.ChooseRaceMenu:
          return ChooseRacePage
        case MenuComponent.AttributesMenu:
          return AttributesPage
        case MenuComponent.AttributesSelectionMenu:
          return AttributesSelectionPage
      }
    },
    pos(): Point | undefined {
      if (this.game.currentMap) {
        return new Point(
          Math.round(this.game.currentMap.width * 0.5),
          Math.round(this.game.currentMap.height * 0.4)
        )
      }
    },
    race(): Race {
      return humanRace
    }
  },
  components: {
    Scene
  },
  methods: {
    loop() {
      if (this.game) {
        this.game.turn()

        if (this.game.done) {
          this.game = this.app.titleGame()
        }
      }
    },
    onEvent(event: KeyboardEvent) {
      this.$refs.menuComponent.onEvent(event)
    }
  },
  created() {
    this.loopIntervalId = window.setInterval(this.loop, LOOP_INTERVAL)
    document.addEventListener('keydown', this.onEvent)
  },
  beforeDestroy() {
    clearInterval(this.loopIntervalId)
    document.removeEventListener('keydown', this.onEvent)
  }
})
</script>

<style lang='scss'>
.title-view {
  width: 40%;
  padding-bottom: 15px;

  > .title {
    line-height: 1rem;
    font-size: 1rem;
    overflow-y: hidden;
  }

  .menu-options {
    width: 60%;
    margin: auto;
  }
}
</style>
