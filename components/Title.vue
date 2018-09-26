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
    .subtitle(v-text='subtitle').d-none
    .content.d-none
      .menu-option(v-for='option in options' :class="{ 'mt-2': option.separator }")
        | [
        span.char(v-text='option.char')
        | ]
        | {{ option.name }}

    PrimaryAttributeSelection(
      v-if='game'
      :race='race'
      :gender-attributes='game.genderAttributes(state.gender)'
    )
</template>

<script lang='ts'>
import Vue from 'vue'

import { Application, Point, TitleGame, Gender, Race, humanRace } from '../src/onisun'
import { sample } from 'lodash'

import Scene from './Scene.vue'
import PrimaryAttributeSelection from './PrimaryAttributeSelection.vue'

const LOOP_INTERVAL = 100

enum Stage {
  Title,
  Gender,
  Race,
  PrimaryAttributes,

  Final,
}

type Option = {
  char: string,
  name: string,
  command: () => void,
  separator?: true
}

type State
  = { stage: Stage.Title }
  | { stage: Stage.Gender }
  | { stage: Stage.Race, gender: Gender }
  | { stage: Stage.PrimaryAttributes, gender: Gender, race: Race }
  | { stage: Stage.Final, gender: Gender, race: Race }

export default Vue.extend({
  name: 'Title',
  data() {
    return {
      game: null as TitleGame | null,
      loopIntervalId: undefined as number | undefined,
      state: { stage: Stage.Title } as State
    }
  },
  computed: {
    genderName(): string {
      return this.state.gender === Gender.Male ? 'male' : 'female'
    },
    raceName(): string {
      return this.state.race === Race.Human ? 'human' : 'dwarf'
    },
    subtitle(): string {
      switch (this.state.stage) {
      case Stage.Gender:
        return 'Choose a gender:'
      case Stage.Race:
        return `You are ${this.genderName}. Choose a race:`
      case Stage.PrimaryAttributes:
        return `You are ${this.genderName} ${this.raceName}. Choose your attributes:`
      default:
        return ''
      }
    },
    options(): Option[] {
      switch (this.state.stage) {
      case Stage.Title:
        return [
          { char: 'N', name: 'New game', command: () => this.state = { stage: Stage.Gender } },
        ]
      case Stage.Gender:
        return [
          { char: 'M', name: 'Male',
            command: () => this.state = { stage: Stage.Race, gender: Gender.Male } },
          { char: 'F', name: 'Female',
            command: () => this.state = { stage: Stage.Race, gender: Gender.Female } },
          { char: '*', name: 'Random', separator: true,
            command: () => this.state = { stage: Stage.Race, gender: sample([Gender.Male, Gender.Female]) || Gender.Male } },
          { char: '=', name: 'Back', separator: true,
            command: () => this.state = { stage: Stage.Title } },
        ]
      case Stage.Race:
        return [
          { char: 'H', name: 'Human',
            command: () => Object.assign(this.state, { stage: Stage.PrimaryAttributes, race: Race.Human }) },
          { char: 'D', name: 'Dwarf',
            command: () => Object.assign(this.state, { stage: Stage.PrimaryAttributes, race: Race.Dwarf }) },
          { char: '*', name: 'Random', separator: true,
            command: () => Object.assign(this.state, { stage: Stage.PrimaryAttributes, race: sample([Race.Dwarf, Race.Human]) || Race.Human }) },
          { char: '=', name: 'Back', separator: true,
            command: () => this.state = { stage: Stage.Gender } },
        ]
      case Stage.PrimaryAttributes:
        return [
          { char: '*', name: 'Random', separator: true,
            command: () => Object.assign(this.state, { stage: Stage.Final }) },
          { char: 'M', name: 'Manually',
            command: () => Object.assign(this.state, { stage: Stage.PrimaryAttributes }) },
          { char: '=', name: 'Back', separator: true,
            command: () => this.state = { stage: Stage.Gender } },
        ]
      default:
        return []
      }
    },
    pos(): Point | undefined {
      if (this.game && this.game.currentMap) {
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
    Scene,
    PrimaryAttributeSelection,
  },
  methods: {
    loop() {
      if (this.game) {
        this.game.turn()

        if (this.game.done) {
          this.game = Application.titleGame()
        }
      }
    },
    onEvent(event: KeyboardEvent) {
      let option = this.options.find(option => option.char === event.key.toUpperCase())

      if (option) {
        option.command()
      } else {
        console.log(event.key)
      }
    }
  },
  created() {
    this.loopIntervalId = window.setInterval(this.loop, LOOP_INTERVAL)
    document.addEventListener('keydown', this.onEvent)
  },
  mounted() {
    this.game = Application.titleGame()
  },
  beforeDestroy() {
    clearInterval(this.loopIntervalId)
    document.removeEventListener('keydown', this.onEvent)
  }
})
</script>

<style lang='scss' scoped>
.title-view {
  width: 40%;
  padding-bottom: 15px;

  > .title {
    line-height: 1rem;
    font-size: 1rem;
    overflow-y: hidden;
  }

  > .content {
    width: 60%;
    margin: auto;
  }
}

.menu-option {
  color: white;

  > .char {
    color: gold;
  }

  &:hover {
    color: gold;
  }
}
</style>
