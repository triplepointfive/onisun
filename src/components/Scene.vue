<template lang='slm'>
  #game
</template>

<script lang='ts'>
import Vue from 'vue'
import { domRenderer, canvasRenderer, webGLRenderer, Viewport } from '../../vendor/unicodetiles.ts/src/index'

export default Vue.extend({
  mounted() {
    let term = new Viewport(
      document.getElementById('game'),
      45,
      25,
      webGLRenderer,
      true
    );

    term.clear();
    term.putString("Hello world!", 0,0, 0,255,0);
    term.putString("Some 俺 ・戸＃chars: ", 0,2, 128,0,0, 0,32,0);
    term.putString("☠☃⚙☻♞☭✈✟✂✯", 0,3, 0,0,255);
    term.putString("☠☃⚙☻♞☭✈✟✂✯", 5,5, 120,120,120, 0, 0, 0);
    term.render();
  }
})
</script>

<style lang='scss'>
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
