<template lang='pug'>
.panel
  .impact-block(v-for='impact in impacts')
    img.icon(:src="'assets/impacts/' + icon(impact) + '.svg'")
    .title
      | Слепота
</template>

<script lang="ts">
import Vue from 'vue'

import { ImpactType } from '../src/engine'

export default Vue.extend({
  name: 'Impacts',
  props: ['impacts'],
  methods: {
    icon(type: ImpactType) {
      switch(type) {
        case ImpactType.Blind:
          return 'blind'
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.impact-block {
  border: 1px solid white;
  color: white;
  width: 200px;

  display: inline-block;
  padding: 0.3rem;

  > .icon {
    width: 50px;
    height: 50px;
    display: inline;
    margin-right: 10px;
  }

  > .title {
    display: inline;
  }
}
</style>
