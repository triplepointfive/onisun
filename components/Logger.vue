<template lang='pug'>
.logger
  div(:class='rowClass(record)' v-for='(record, i) in messages' :key='i')
    | {{ record.message }}
    | {{ counter(record.counter) }}
</template>

<script lang='ts'>
import Vue from 'vue'

import { takeRight } from 'lodash'

import { LogLevel, LogMessage, Logger } from '../src/engine'

export default Vue.extend({
  name: 'Logger',
  props: {
    logger: {
      type: Logger,
      required: true
    }
  },
  data() {
    return {
      lastId: 0,
    }
  },
  computed: {
    messages() {
      const currentMessagesCount: number = this.logger.messages.length,
        messages = takeRight(this.logger.messages, Math.max(currentMessagesCount - this.lastId, 5))
      this.lastId = currentMessagesCount
      return messages
    }
  },
  methods: {
    counter(value: number) {
      if (value > 1) {
        return `x${value}`
      }
    },
    rowClass(record: LogMessage) {
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
