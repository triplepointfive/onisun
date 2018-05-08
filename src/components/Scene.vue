<template lang='slm'>
  .scene
    .fps {{ fps }}
    .unicodetiles ref="scene"
    input v-model='interval' type='number'
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
  WallTile,
} from './scene_tiles'

const HUMAN = new CreatureTile('俺', 0, 255, 0)
const DOOR = new DoorTile()
const WALL = new WallTile()
const FLOOR = new FloorTile()
const NULLTILE = new Tile('　', 0, 0, 0)

export default Vue.extend({
  props: ['level', 'player'],
  data() {
    return {
      term: null,
      eng: null,
      drawInterval: null,
      ts: Date.now(),
      fps: 0,
      counter: 0,
      interval: 200,
    }
  },
  methods: {
    getTile(x, y) {
      const tile = this.stage.at(x, y).tile
      if (!tile) {
        return NULLTILE
      }

      if (tile.creature) {
        return HUMAN
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
      this.level.turn()

      // this.eng.update(this.player.x, this.player.y);
      this.eng.update(this.term.cx, this.term.cy);
      this.term.render();

      this.done = false
      this.counter += 1
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
    }
  },
  mounted() {
    this.initViewport()
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
