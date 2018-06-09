<template>
  <div class='logger' ref='container'>
    <table class='table table-sm table-striped'>
      <tbody>
        <tr :class='rowClass(record)' v-for='(record, i) in messages' :key='i'>
          <td>{{ ts(record) }}</td>
          <td>{{ record.message }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { takeRight } from 'lodash'

import { LogLevel } from '../src/onisun'

import * as moment from 'moment'

export default Vue.extend({
  name: 'Logger',
  props: ['logger'],
  computed: {
    messages() {
      return takeRight(this.logger.messages, 5)
    }
  },
  methods: {
    ts(record) {
      return moment(record.ts).format("hh:mm:ss")
    },
    rowClass(record) {
      switch (record.level) {
        case LogLevel.DEBUG:
          return 'table-secondary'
        case LogLevel.INFO:
          return 'table-info'
        case LogLevel.WARNING:
          return 'table-warning'
        case LogLevel.DANGER:
          return 'table-danger'
      }
    }
  }
})
</script>

<style lang='scss'>
.logger {
  height: 200px;
  overflow-y: scroll;
}
</style>
