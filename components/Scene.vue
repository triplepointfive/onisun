<template>
  <div class='scene'>
    <div class='row'>
      <div class='col mr-0'>
        <div class='unicodetiles' ref="scene"></div>
      </div>

      <div class='col pl-0'>
        <div class='fps mb-2 '>FPS {{ fps }}</div>

        <input type='checkbox' v-model='wholeMap'>

        <Stats :creature='level.creatures[0]'/>

        <div class='form-group row'>
          <div class='col-sm-2'>Map</div>
          <div class='col-sm-10'>
            <div class='form-group'>
              <input class='form-control' id='interval' v-model='interval' type='number'/>
              <label class='form-check-label' for='interval'>
                Tick interval
              </label>
            </div>

            <button class='btn btn-secondary' @click='nextStep = true'>
              Next step
            </button>

            <button class='btn btn-secondary' @click="pause = !pause">
              {{ pause ? 'Start' : 'Pause' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang='ts'>
import Vue from 'vue'
import Stats from './stats.vue'

import {
  domRenderer,
  canvasRenderer,
  webGLRenderer,
  Engine,
  Viewport,
  Tile,
} from '../vendor/unicodetiles.ts/src/index'

import {
  CreatureTile,
  DoorTile,
  FloorTile,
  ItemTile,
  WallTile,
  StairwayUp,
  StairwayDown,
  DisplayTile,

  displayItem,
} from './scene_tiles'

const HUMAN  = new CreatureTile('俺', 0, 255, 0)
const HUMAN2 = new CreatureTile('俺', 255, 0, 0)
const HUMAN3 = new CreatureTile('俺', 0, 0, 255)
const HUMAN4 = new CreatureTile('俺', 255, 0, 255)
const HUMAN5 = new CreatureTile('俺', 0, 255, 255)

const DOOR = new DoorTile()
const WALL = new WallTile()
const FLOOR = new FloorTile()
const STAIRWAY_DOWN = new StairwayDown()
const STAIRWAY_UP = new StairwayUp()
const NULLTILE = new DisplayTile('　', 0, 0, 0)

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
      wholeMap: true,
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
  components: {
    Stats
  },
  methods: {
    getTile(x, y) {
      const tile = this.wholeMap ? this.stage.at(x, y) : this.stage.at(x, y).tile

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
      case '<':
        return STAIRWAY_UP
      case '>':
        return STAIRWAY_DOWN
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
        return this.wholeMap || this.stage.at(x, y).seen
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
      if (this.wholeMap) {
        return tile.lighted(1)
      }
      const fovTile = this.stage.at(x, y)

      if (fovTile.visible && tile.lighted) {
        return tile.lighted(fovTile.degree)
      }

      return tile
    },
  },
  computed: {
    stage() {
      return this.wholeMap ? this.level : this.player.stageMemory(this.level.id)
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
  font-family: "DejaVuSansMono", "DejaVu Sans Mono", monospace;
  font-size: 16px;
  white-space: pre;
  text-align: center;
  line-height: 1;
  letter-spacing: 0px;
  display: inline-block;

  div {
    float: left;
    height: 1em;
  }

  br {
    clear: both;
  }
}
</style>
