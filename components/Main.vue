<template lang='pug'>
.container-fluid

  Game(
    ref='gameComponent'
    :game='game'
    v-if='game'
  )
  Scene(
    :level='background.currentMap'
    :player='background.player'
    :pos='backgroundPos'
    v-else-if='background'
  )

  .title-view.screen-modal(v-if='app.menu')
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

import AttributesSelectionPage from './Menu/AttributesSelectionMenu.vue'
import ChooseGenderPage from './Menu/ChooseGenderMenu.vue'
import ChooseProfessionPage from './Menu/ChooseProfessionMenu.vue'
import ChooseRacePage from './Menu/ChooseRaceMenu.vue'
import EnterNamePage from './Menu/EnterNameMenu.vue'
import BackgroundPage from './Menu/BackgroundMenu.vue'
import MainMenuPage from './Menu/MainMenu.vue'
import PickTalentsPage from './Menu/PickTalentsMenu.vue'

import Game from './Game.vue'

import {
  Application,
  Point,
  TitleGame,
  Gender,
  Race,
  humanRace,
  MainMenu,
  MenuComponent,
  Onisun
} from '../src/onisun'

import Scene from './Scene.vue'

const LOOP_INTERVAL = 10

export default Vue.extend({
  name: 'Main',
  data() {
    const app = new Application()
    return {
      app: app,
      background: app.newTitleGame() as TitleGame,
      loopIntervalId: undefined as number | undefined,
      step: 0
    }
  },
  computed: {
    menuPage(): Component | undefined {
      if (!this.app.menu) {
        return
      }

      switch (this.app.menu.component) {
        case MenuComponent.MainMenu:
          return MainMenuPage
        case MenuComponent.ChooseGenderMenu:
          return ChooseGenderPage
        case MenuComponent.ChooseRaceMenu:
          return ChooseRacePage
        case MenuComponent.ChooseProfessionMenu:
          return ChooseProfessionPage
        case MenuComponent.AttributesSelectionMenu:
          return AttributesSelectionPage
        case MenuComponent.EnterNameMenu:
          return EnterNamePage
        case MenuComponent.BackgroundMenu:
          return BackgroundPage
        case MenuComponent.PickTalentsMenu:
          return PickTalentsPage
      }
    },
    backgroundPos(): Point | undefined {
      if (this.background.currentMap) {
        return new Point(
          Math.round(this.background.currentMap.width * 0.5),
          Math.round(this.background.currentMap.height * 0.4)
        )
      }
    },
    game(): Onisun | null {
      return this.app.mainGame
    }
  },
  components: {
    Scene,
    Game
  },
  methods: {
    loop() {
      const gameComponent = this.$refs.gameComponent

      if (this.game && this.$refs.gameComponent) {
        this.$refs.gameComponent.loop()
        return
      }

      if (this.background) {
        this.step += 1

        if (this.step >= 10) {
          this.step = 0
          this.background.turn()

          if (this.background.done) {
            this.background = this.app.newTitleGame()
          }
        }
      }
    },
    onEvent(event: KeyboardEvent) {
      const gameComponent = this.$refs.gameComponent
      if (gameComponent) {
        gameComponent.onEvent(event)
      }

      const menuComponent = this.$refs.menuComponent
      if (menuComponent) {
        menuComponent.onEvent(event)
      }
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
  }

  .menu-options {
    width: 60%;
    margin: auto;
  }
}
</style>
