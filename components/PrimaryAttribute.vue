<template lang='pug'>
.simple-popover(:id="id")
  .title {{ name }}
  .value {{ attr.current }}
  b-popover(
    :target='id'
    triggers='hover'
    :container='id'
    placement='top'
    )
    template
      big.name {{ fullName }}
      p
        span.name Базовый:
        |
        |
        span.description {{ attr.current }}
      p
        span.name Модификатор:
        |
        |
        span.description {{ modifier }}
</template>

<script lang="ts">
import Vue from 'vue'

import { sum } from 'lodash'

export default Vue.extend({
  name: 'PrimaryAttribute',
  props: ['name', 'slug', 'attr', 'fullName'],
  computed: {
    id(): string {
      return `${this.slug}-container`
    },
    modifier(): number {
      return sum(this.attr.modifiers)
    }
  }
})
</script>
