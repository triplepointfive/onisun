<template>
  <div class='level-up text-center'>
    <div>
      <span
        class='option p-2 m-3'
        v-for='option in screen.options'
        :key='option.id'
        @click='picked = option'
        :class="{ 'picked': picked && picked.id === option.id }"
      >
        {{ option.name }}
      </span>
    </div>

    <a @click='close' v-if='picked !== null'>Подтвердить</a>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import * as _ from 'lodash'

import Cell from './Cell.vue'
import Logger from './Logger.vue'

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      picked: null
    }
  },
  computed: {
    valid() {
      return
    }
  },
  methods: {
    close() {
      this.screen.onInput(this.picked)
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
.option {
  border: 1px solid black;

  &.picked {
    border-color: red;
  }
}
</style>
