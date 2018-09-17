<template lang='pug'>
.title-view.screen-modal
  pre.title
    |  ██████╗ ███╗   ██╗██╗███████╗██╗   ██╗███╗   ██╗
    | ██╔═══██╗████╗  ██║██║██╔════╝██║   ██║████╗  ██║
    | ██║   ██║██╔██╗ ██║██║███████╗██║   ██║██╔██╗ ██║
    | ██║   ██║██║╚██╗██║██║╚════██║██║   ██║██║╚██╗██║
    | ╚██████╔╝██║ ╚████║██║███████║╚██████╔╝██║ ╚████║
    |  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
  .content
    .menu-option(v-for='option in options')
      | [
      span.char(v-text='option.char')
      | ]
      | {{ option.name }}

</template>

<script lang='ts'>
import Vue,{ VueConstructor } from 'vue'

export default Vue.extend({
  name: 'Title',
  computed: {
    options() {
      return [
        { char: 'N', name: 'New game' },
      ]
    }
  }
})
</script>

<style lang='scss' scoped>
.title-view {
  width: 40%;
  padding-bottom: 15px;

  > .title {
    line-height: 0.9rem;
  }

  > .content {
    width: 60%;
    margin: auto;
  }
}

.menu-option {
  color: white;

  > .char {
    color: gold;
  }
}
</style>
