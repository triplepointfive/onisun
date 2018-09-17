<template lang='pug'>
#app
  Scene.scene(
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
    .content
      .menu-option(v-for='option in options')
        | [
        span.char(v-text='option.char')
        | ]
        | {{ option.name }}
</template>

<script lang='ts'>
import Vue from 'vue'

import { Application, Point } from '../src/onisun'

import Scene from './Scene.vue'

const LOOP_INTERVAL = 100

export default Vue.extend({
  name: 'Title',
  data() {
    return {
      game: null
    }
  },
  computed: {
    options() {
      return [
        { char: 'N', name: 'New game' },
      ]
    },
    pos(): Point | undefined {
      if (this.game && this.game.currentMap) {
        return new Point(
          Math.round(this.game.currentMap.width * 0.5),
          Math.round(this.game.currentMap.height * 0.4)
        )
      }
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
          this.game = Application.titleGame()
        }
      }
    },
    onEvent(event: KeyboardEvent) {
      console.log(event.key)
    }
  },
  created() {
    this.loopIntervalId = setInterval(this.loop, LOOP_INTERVAL)
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
}
</style>
