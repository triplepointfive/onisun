<template>
  <h3>
    123123
    <a @click='close'>XXX</a>
  </h3>
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
