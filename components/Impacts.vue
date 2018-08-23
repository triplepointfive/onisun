<template lang='pug'>
.panel
  .impact-block(v-for='impact in impacts')
    img.icon(:src="'assets/impacts/' + icon(impact) + '.svg'")
    .title(v-text='title(impact)')
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
        case ImpactType.Stressed:
          return 'weight'
        case ImpactType.Loaded:
          return 'weight'
        case ImpactType.Overloaded:
          return 'weight'
      }
    },
    title(type: ImpactType) {
      switch(type) {
        case ImpactType.Blind:
          return 'Слепота'
        case ImpactType.Stressed:
          return 'Нагружен'
        case ImpactType.Loaded:
          return 'Груженый'
        case ImpactType.Overloaded:
          return 'Перегруженый'
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

  padding: 0.3rem;

  > .icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  > .title {
    display: inline;
  }
}
</style>
