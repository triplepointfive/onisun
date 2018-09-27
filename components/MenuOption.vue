<template lang="pug">
.menu-option(:class='{ "-separator": separator }')
  | [
  span.char(v-text='char')
  | ]
  | {{ name }}
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'MenuOption',
  props: ['char', 'name', 'separator']
})
</script>

<style lang="scss" scoped>
.menu-option {
  color: white;
  cursor: pointer;

  > .char {
    color: gold;
  }

  &:hover {
    color: gold;
  }

  &.-separator {
    margin-top: 0.5rem;
  }
}
</style>
