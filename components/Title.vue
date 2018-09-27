<template lang='pug'>
#app
  Scene.d-none(
    :level='game.currentMap'
    :player='game.player'
    :pos='pos'
    v-if='game'
    )

  .title-view.screen-modal
    pre.title.d-none
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
      game: app.newTitleGame() as TitleGame,
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
        case MenuComponent.ChooseProfessionMenu:
          return ChooseProfessionPage
        case MenuComponent.AttributesSelectionMenu:
          return AttributesSelectionPage
        case MenuComponent.EnterNameMenu:
          return EnterNamePage
        case MenuComponent.BackgroundMenu:
          return BackgroundPage
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
          this.game = this.app.newTitleGame()
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
