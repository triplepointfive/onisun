<template>
  <div class='level-up text-center'>
    <div>
      <div
        class='option p-2 m-3'
        v-for='option in screen.options'
        :key='option.id'
        @click='picked = option'
        @dblclick="close(option)"
        :class="{ 'picked': picked && picked.id === option.id }"
      >
        <div>{{ option.name }}</div>
        <img class='icon' :src='iconPath(option.id)'>
      </div>
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
    close(doubleClickOption) {
      this.screen.onInput(doubleClickOption || this.picked)
    },
    iconPath(professionId: number) {
      return 'assets/professions/' + [
        'acrobatic.svg',
        'button-finger.svg',
        'disintegrate.svg',
        'flying-fox.svg',
        'amputation.svg',
        'catch.svg',
        'divert.svg',
        'fruiting.svg',
        'annexation.svg',
        'conversation.svg',
        'dodging.svg',
        'grab.svg',
        'arrest.svg',
        'convince.svg',
        'drinking.svg',
        'journey.svg',
        'back-forth.svg',
        'coronation.svg',
        'drop-weapon.svg',
        'juggler.svg',
        'backstab.svg',
        'crafting.svg',
        'drowning.svg',
        'jump-across.svg',
        'boot-stomp.svg',
        'crush.svg',
        'eating.svg',
        'kindle.svg',
        'bowman.svg',
        'discussion.svg',
        'expander.svg',
        'kneeling.svg',
      ][professionId]
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

  .icon {
    width: 100px;
    height: 100px;
  }
}
</style>
