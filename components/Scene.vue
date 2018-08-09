<template lang='pug'>
.unicodetiles(ref='scene')
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

const RAT = new CreatureTile('ｄ', 197, 65, 38)

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
  props: ['level', 'player'],
  data() {
    return {
      wholeMap: false,
      term: null,
      eng: null,
      drawInterval: null,
      ts: Date.now(),
      interval: 100,
      step: 0,
    }
  },
  methods: {
    getTile(x, y) {
      const effect = this.stage.at(x, y).effect
      const tile = this.wholeMap ? this.stage.at(x, y) : this.stage.at(x, y).tile

      if (!tile) {
        return NULLTILE
      }

      if (effect) {
        if (tile.creature) {
          let displayTile = this.creatureTile(tile.creature).clone()
          displayTile.setBackground(200, 0, 0)
          return displayTile
        } else {
          return new DisplayTile(effect, 200, 200, 0)
        }
      }

      if (tile.creature) {
        return this.creatureTile(tile.creature)
      }

      if (tile.items) {
        switch (tile.items.bunch.length) {
        case 0:
          break;
        case 1:
          return displayItem(tile.items.bunch[0].item)
        default:
          const frame = this.step % (this.animationFps * 3 + 4)
          if (frame < nextItemAnimation.length) {
            return nextItemAnimation[frame]
          } else {
            const itemId = Math.floor(this.step / (this.animationFps * 3 + 4))

            return displayItem(tile.items.bunch[itemId % tile.items.bunch.length].item)
          }
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
    creatureTile(creature) {
      if (creature.name() == 'Rat') {
        return RAT
      }

      switch (creature.id % 5) {
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
        this.level.height,
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
      const ts = Date.now()
      if (this.ts + 1000 < ts) {
        this.ts = ts
      }

      // this.eng.update(this.player.x, this.player.y);
      this.eng.update(this.term.cx, this.term.cy);
      this.term.render();

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
    },
    tileItems() {
      let items = this.stage.at(this.player.pos.x, this.player.pos.y).items()
      return items && items.bunch
    }
  },
  mounted() {
    this.initViewport()
  },
  beforeDestroy() {
    clearInterval(this.drawInterval)
  },
  watch: {
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
