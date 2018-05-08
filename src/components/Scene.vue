<template lang='slm'>
  .scene
    .fps {{ fps }}
    .unicodetiles ref="scene"
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
} from './tile'

const HUMAN = new CreatureTile('俺', 0, 255, 0)
const DOOR = new DoorTile()
const WALL = new WallTile()
const FLOOR = new FloorTile()
const NULLTILE = new Tile('　', 0, 0, 0)

export default Vue.extend({
  props: ['scene', 'player'],
  data() {
    return {
      term: null,
      eng: null,
      drawInterval: null,
      ts: Date.now(),
      fps: 0,
      counter: 0,
    }
  },
  methods: {
    getTile(x, y) {
      if (this.scene.at(x, y).creature) {
        return HUMAN
      }

      switch (this.scene.at(x, y).display) {
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
        this.scene.width,
        this.scene.height,
        webGLRenderer,
        true,
      )

      this.eng = new Engine(
        this.term,
        (x, y) => this.getTile(x, y),
        this.scene.width,
        this.scene.height
      )

      this.eng.setMaskFunc((x, y) => {
        return this.stage.at(x, y).seen
      });

      this.eng.setShaderFunc((tile, x, y, time) => {
        return this.lighting(tile, x, y, time)
      })

      clearInterval(this.drawInterval)
      this.drawInterval = setInterval(() => { this.drawScene() }, 50)
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
      this.player.act(this.scene)

      // this.eng.update(this.term.cx, this.term.cy);
      // this.term.put(HUMAN, this.term.cx, this.term.cy)
      this.eng.update(this.player.x, this.player.y);
      // this.term.put(HUMAN, this.term.cx, this.term.cy)
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
      return this.player.stageMemory(this.scene.id)
    }
  },
  mounted() {
    this.initViewport()
  },
  watch: {
    scene() {
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
