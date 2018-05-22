<template lang='slm'>
  .scene
    .row
      .col.mr-0
        .unicodetiles ref="scene"

      .col.pl-0
        .fps.mb-2 FPS {{ fps }}

        dl.row.small v-for='creature in level.creatures'
          dd.col-sm-3 ID
          dt.col-sm-9 {{ creature.id }}

          dd.col-sm-3 POS
          dt.col-sm-9 {{ creature.pos }}

          dd.col-sm-3 AI
          dt.col-sm-9
            | {{ aiName(creature.ai) }}

        .form-group.row
          .col-sm-2 Map
          .col-sm-10
            .form-group
              input.form-control#interval v-model='interval' type='number'
              label.form-check-label for='interval'
                | Tick interval

            button.btn.btn-secondary> @click='nextStep = true'
              | Next step

            button.btn.btn-secondary> @click="pause = !pause"
              | {{ pause ? 'Start' : 'Pause' }}
</template>

<script lang='ts'>
import Vue from 'vue'
import {
  domRenderer,
  canvasRenderer,
  webGLRenderer,
  Engine,
  Viewport,
  Tile,
} from '../../vendor/unicodetiles.ts/src/index'

import {
  CreatureTile,
  DoorTile,
  FloorTile,
  ItemTile,
  WallTile,

  displayItem,
} from './scene_tiles'

import {
  Patrol,
  Explorer,
  Waiter,
  Chaser,
  Escaper,
  Loiter,
  Dispatcher,
} from '../ai'

import {
  Katana,
  ItemKind,
} from '../items'

const HUMAN  = new CreatureTile('俺', 0, 255, 0)
const HUMAN2 = new CreatureTile('俺', 255, 0, 0)
const HUMAN3 = new CreatureTile('俺', 0, 0, 255)
const HUMAN4 = new CreatureTile('俺', 255, 0, 255)
const HUMAN5 = new CreatureTile('俺', 0, 255, 255)

const DOOR = new DoorTile()
const WALL = new WallTile()
const FLOOR = new FloorTile()
const NULLTILE = new Tile('　', 0, 0, 0)

const nextItemAnimation = [
  new ItemTile('｜', 200, 200, 200),
  new ItemTile('／', 200, 200, 200),
  new ItemTile('ー', 200, 200, 200),
  new ItemTile('＼', 200, 200, 200),
]

export default Vue.extend({
  props: ['level'],
  data() {
    return {
      term: null,
      eng: null,
      drawInterval: null,
      ts: Date.now(),
      fps: 0,
      counter: 0,
      interval: 100,
      nextStep: false,
      step: 0,
      pause: false,
      player: this.level.creatures[0]
    }
  },
  methods: {
    aiName(ai) {
      if (ai instanceof Patrol) {
        return 'Patrol'
      }
      if (ai instanceof Escaper) {
        return 'Escaper'
      }
      if (ai instanceof Chaser) {
        return 'Chaser'
      }
      if (ai instanceof Explorer) {
        return 'Explorer'
      }
      if (ai instanceof Waiter) {
        return 'Waiter'
      }
      if (ai instanceof Loiter) {
        return `Loiter (${this.aiName(ai.prevAI)})`
      }
      if (ai instanceof Dispatcher) {
        return `Dispatcher (${this.aiName(ai.prevAI)})`
      }
    },
    getTile(x, y) {
      const tile = this.stage.at(x, y).tile
      if (!tile) {
        return NULLTILE
      }

      if (tile.creature) {
        switch (tile.creature.id % 5) {
          case 0:
            return HUMAN5
          case 1:
            return HUMAN4
          case 2:
            return HUMAN3
          case 3:
            return HUMAN2
          case 4:
            return HUMAN
        }
      }

      if (tile.items.length) {
        if (tile.items.length === 1) {
          return displayItem(tile.items[0])
        }

        const frame = this.step % (this.animationFps * 3 + 4)
        if (frame < nextItemAnimation.length) {
          return nextItemAnimation[frame]
        } else {
          const itemId = Math.floor(this.step / (this.animationFps * 3 + 4))

          return displayItem(tile.items[itemId % tile.items.length])
        }
      }

      switch (tile.display) {
      case '#':
        return WALL
      case '+':
        return DOOR
      case ' ':
        return FLOOR
      default:
        return NULLTILE
      }
    },
    initViewport() {
      this.term = new Viewport(
        this.$refs.scene,
        this.level.width,
        this.level.height,
        webGLRenderer,
        true,
      )

      this.eng = new Engine(
        this.term,
        (x, y) => this.getTile(x, y),
        this.level.width,
        this.level.height
      )

      this.eng.setMaskFunc((x, y) => {
        return this.stage.at(x, y).seen
      });

      this.eng.setShaderFunc((tile, x, y, time) => {
        return this.lighting(tile, x, y, time)
      })

      clearInterval(this.drawInterval)
      this.drawInterval = setInterval(() => { this.drawScene() }, this.interval)
    },
    drawScene() {
      if (this.done) { return }
      const ts = Date.now()
      if (this.ts + 1000 < ts) {
        this.fps = this.counter
        this.counter = 0
        this.ts = ts
      }

      this.done = true
      if (!this.pause || this.nextStep) {
        this.nextStep = false

        this.level.turn()
        this.player = this.level.creatures[0]
      }

      // this.eng.update(this.player.x, this.player.y);
      this.eng.update(this.term.cx, this.term.cy);
      this.term.render();

      this.done = false
      this.counter += 1
      this.step += 1
    },
    lighting(tile, x, y, time) {
      const fovTile = this.stage.at(x, y)

      if (fovTile.visible && tile.lighted) {
        return tile.lighted(fovTile.degree)
      }

      return tile
    }
  },
  computed: {
    stage() {
      return this.player.stageMemory(this.level.id)
    },
    animationFps() {
      return 1000 / this.interval
    }
  },
  mounted() {
    this.initViewport()
  },
  beforeDestroy() {
    clearInterval(this.drawInterval)
  },
  watch: {
    level() {
      this.initViewport()
    },
    interval() {
      this.initViewport()
    }
  }
})
</script>

<style lang='scss'>
.unicodetiles {
  background-color: black;
}

.unicodetiles {
  font-family: "DejaVuSansMono", "DejaVu Sans Mono", monospace;
  font-size: 16px;
  white-space: pre;
  text-align: center;
  line-height: 1;
  letter-spacing: 0px;
  display: inline-block;
}

.unicodetiles div {
  float: left;
  height: 1em;
}

.unicodetiles br {
  clear: both;
}
</style>
