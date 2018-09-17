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
  ItemTile,
  DisplayTile,

  displayItem,
  displayTile,
} from './scene_tiles'
import { Creature, Point } from 'src/engine';

const HUMAN  = new CreatureTile('＠', 0, 255, 0)
const RAT = new CreatureTile('r', 197, 65, 38)
const GOLEM = new CreatureTile('G', 120, 120, 120)
const NULL_TILE = new DisplayTile('　', 0, 0, 0)

const nextItemAnimation = [
  new ItemTile('｜', 200, 200, 200),
  new ItemTile('／', 200, 200, 200),
  new ItemTile('ー', 200, 200, 200),
  new ItemTile('＼', 200, 200, 200),
]

export default Vue.extend({
  props: ['level', 'player', 'pos'],
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
    getTile(x: number, y: number) {
      const effect = this.stage.at(x, y).effect
      const tile = this.wholeMap ? this.stage.at(x, y) : this.stage.at(x, y).tile

      if (!tile) {
        return NULL_TILE
      }

      if (effect) {
        if (tile.creature) {
          let dTile = this.creatureTile(tile.creature).clone()
          dTile.setBackground(200, 0, 0)
          return dTile
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

      return displayTile(tile)
    },
    creatureTile(creature: Creature) {
      if (creature.name == 'Rat') {
        return RAT
      }

      if (creature.name == 'Golem') {
        return GOLEM
      }

      return HUMAN
    },
    initViewport() {
      this.term = new Viewport(
        this.$refs.scene,
        Math.max(this.level.width, 40),
        Math.max(this.level.height, 40),
        webGLRenderer,
        true,
      )

      this.eng = new Engine(
        this.term,
        (x: number, y: number) => this.getTile(x, y),
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

      this.eng.update(this.pos.x, this.pos.y);
      // this.eng.update(this.term.cx, this.term.cy);
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
      return this.wholeMap ? this.level : this.player.stageMemory(this.level)
    },
    animationFps(): number {
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
    interval() {
      this.initViewport()
    },
    level() {
      clearInterval(this.drawInterval)
      this.initViewport()
    }
  }
})
</script>

<style lang='scss'>
.unicodetiles {
  background-color: black;
  font-family: "DejaVuSansMono", "DejaVu Sans Mono", monospace;
  font-size: 2rem;
  white-space: pre;
  text-align: center;
  line-height: 1;
  letter-spacing: 0px;
  display: inline-block;

  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 30%;

  div {
    float: left;
    height: 1em;
  }

  br {
    clear: both;
  }
}
</style>
