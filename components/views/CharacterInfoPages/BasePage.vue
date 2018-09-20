<template lang="pug">
.content
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BasePage',
  props: ['screen'],
  methods: {
    onEvent(event: KeyboardEvent): void {}
  }
})
</script>

<style lang="scss" scoped>
.content-col {
  display: inline-block;
  vertical-align: top;
  margin-right: 3rem;
}

.attribute-row {
  > td {
    border: none;
    padding: 0;
  }

  > .name {
    color: yellow;
  }

  > .value {
    color: white;
  }
}
</style>
