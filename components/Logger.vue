<template lang='pug'>
.logger
  div(:class='rowClass(record)' v-for='(record, i) in messages' :key='i')
    | {{ record.message }}
    | {{ counter(record.counter) }}
</template>

<script lang='ts'>
import Vue from 'vue'

import { takeRight } from 'lodash'

import { LogLevel } from '../src/engine'

export default Vue.extend({
  name: 'Logger',
  props: ['logger'],
  data() {
    return {
      lastId: 0,
    }
  },
  computed: {
    messages() {
      return takeRight(this.logger.messages, 5)
    }
  },
  methods: {
    counter(value) {
      if (value) {
        return `x${value}`
      }
    },
    rowClass(record) {
      switch (record.level) {
        case LogLevel.DEBUG:
          return 'debug'
        case LogLevel.INFO:
          return 'info'
        case LogLevel.WARNING:
          return 'warning'
        case LogLevel.DANGER:
          return 'danger'
      }
    }
  }
})
</script>

<style lang='scss' scoped>
.logger {
  .debug {
    color: grey;
  }

  .warning {
    color: orange;
  }

  .info {
    color: yellow;
  }

  .danger {
    color: red;
  }
}
</style>
