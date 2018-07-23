<template>
  <div class='level-up'>
    123123
    <a @click='close'>XXX</a>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import * as _ from 'lodash'

import Cell from './Cell.vue'
import Logger from './Logger.vue'

export default Vue.extend({
  props: ['screen'],
  methods: {
    close() {
      this.screen.onInput()
    }
  }
})
</script>

<style lang='scss'>
.level-up {
  position: fixed;
  top: 10%;
  left: 30%;
  width: 40%;
  height: 40%;
  border: 1px solid black;
  background: white;
  border-radius: 50px;
  padding: 30px;
}
</style>
