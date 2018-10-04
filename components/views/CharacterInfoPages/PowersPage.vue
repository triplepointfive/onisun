<template lang="pug">
.content
  table.table-sm
    tbody
      tr(v-for='power in screen.powers')
        td.keyboard-key 1
        td.name {{ power }}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PowersPage',
  props: ['screen'],
  methods: {
    onEvent(event: KeyboardEvent): void {}
  }
})
</script>

<style lang="scss" scoped>
.content {
  .name {
    color: white;
  }
}
</style>
