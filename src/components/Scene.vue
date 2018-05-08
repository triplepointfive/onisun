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
        return this.fov[y][x].seen
      });

      this.eng.setShaderFunc((tile, x, y, time) => {
        return this.lighting(tile, x, y, time)
      })

      clearInterval(this.drawInterval)
      this.drawInterval = setInterval(() => { this.drawScene() }, 50)
    },
    drawScene() {
      // this.eng.update(this.term.cx, this.term.cy);
      // this.term.put(HUMAN, this.term.cx, this.term.cy)
      this.eng.update(this.player.x, this.player.y);
      // this.term.put(HUMAN, this.term.cx, this.term.cy)
      this.term.render();
    },
    lighting(tile, x, y, time) {
      const fovTile = this.fov[y][x]

      if (fovTile.visible && tile.lighted) {
        return tile.lighted(fovTile.degree)
      }

      return tile
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
