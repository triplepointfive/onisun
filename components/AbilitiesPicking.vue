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

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      picked: null
    }
  },
  methods: {
    close(doubleClickOption) {
      this.screen.onInput(doubleClickOption || this.picked)
    }
  }
})
</script>

<style lang='scss'>
.level-up {
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border: 1px solid black;
  background: white;
  border-radius: 50px;
  padding: 30px;
  z-index: 3
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

