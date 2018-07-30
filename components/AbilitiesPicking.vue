<template>
  <div class='level-up text-center'>
    <div ref='container'>

    </div>
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
    },
    onEvent(event) {

    }
  },
  mounted() {

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

