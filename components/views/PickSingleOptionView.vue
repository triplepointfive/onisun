<template lang='pug'>
.screen-modal
  span.title(v-text='title')

  table.container.options-list
    tr(v-for='(option, index) in screen.options' :key='index')
      td.letter {{ indexLetter(index) }}
      td.separator &mdash;
      td.name(v-text='optionName(option)')
</template>

<script lang='ts'>
import Vue from 'vue'

import { PresenterType } from '../../src/onisun'

const LETTER_OFFSET = 97

export default Vue.extend({
  name: 'PickSingleOptionView',
  props: ['screen'],
  data() {
    return {
      page: 0,
      perPage: 20,
      selected: [],
    }
  },
  computed: {
    title(): string {
      switch (this.screen.type) {
      case PresenterType.PickHandleOption:
        return 'С чем взаимодействовать?'
      }
    }
  },
  methods: {
    optionName(option): string {
      switch (this.screen.type) {
      case PresenterType.PickHandleOption:
        return option[0]
      }
    },
    onEvent(event: KeyboardEvent) {
      switch (event.key) {
      case 'Escape':
        return this.screen.close()
      case 'Enter':
      case ' ':
        return this.screen.pickUpItems(this.selected.map(index => this.screen.positions[index]))
      default:
        return this.selectAt(event.key.charCodeAt(0) - LETTER_OFFSET)
      }
    },
    selectAt(i: number) {
      if (i >= 0 && i < Math.min(this.perPage, this.screen.options.length)) {
        this.screen.pick(this.screen.options[i])
      }
    },
    indexLetter(i: number): string {
      return String.fromCharCode(LETTER_OFFSET + i)
    }
  }
})
</script>

<style lang="scss" scoped>
.options-list {
  table-layout: fixed;

  tr {
    color: white;
  }

  .letter {
    text-transform: uppercase;
  }

  .separator {
    padding-left: 1rem;
  }

  .name {
    padding-left: 2rem;
    overflow: hidden;
    width: 100%;
  }
}
</style>
