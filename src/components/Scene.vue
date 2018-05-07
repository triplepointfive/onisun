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
      eng: null
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

      setInterval(() => { this.tick() }, 50)
    },
    tick() {
      // if (updateFOV) updateFOV(pl.x, pl.y); // Update field of view (used in some examples)
      this.eng.update(this.player.x, this.player.y); // Update tiles
      this.term.put(AT, this.term.cx, this.term.cy)
      this.term.render(); // Render
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
