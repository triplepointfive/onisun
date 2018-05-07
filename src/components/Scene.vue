<template lang='slm'>
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

const AT = new Tile('俺', 255, 255, 255)
const DOOR = new Tile('戸', 255, 255, 255)
const WALL = new Tile('＃', 200, 200, 200)
const FLOOR = new Tile('・', 250, 250, 250)
const NULLTILE = new Tile('　', 0, 0, 0)

export default Vue.extend({
  props: ['scene', 'player', 'fov'],
  data() {
    return {
      term: null,
      eng: null,
      drawInterval: null
    }
  },
  methods: {
    getTile(x, y) {
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
        return this.fov[y][x].seen
      });

      this.eng.setShaderFunc((tile, x, y, time) => {
        return this.lighting(tile, x, y, time)
      })

      clearInterval(this.drawInterval)
      this.drawInterval = setInterval(() => { this.drawScene() }, 50)
    },
    drawScene() {
      this.eng.update(this.player.x, this.player.y);
      this.term.put(AT, this.term.cx, this.term.cy)
      this.term.render();
    },
    lighting(tile, x, y, time) {
      const fovTile = this.fov[y][x]
      if (!fovTile.visible) {
        return tile
      }

      // TODO: extract to a class

      let lightedTile = tile.clone()
      if (tile !== DOOR) {
        lightedTile.r = 255 * fovTile.degree
        lightedTile.g = 165 * fovTile.degree
        lightedTile.b = 0 * fovTile.degree
      } else {
        lightedTile.r = 0
        lightedTile.g = 0
        lightedTile.b = 0
      }

      if (tile !== FLOOR) {
        lightedTile.br = 255 * fovTile.degree
        lightedTile.bg = 165 * fovTile.degree
        lightedTile.bb = 0 * fovTile.degree
      }

      return lightedTile
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
