<template lang='pug'>
.screen-modal
  span.title {{ screen.title }}
  .subtitle.my-3(v-text='carryingWeight')

  table.container.positions-list
    tr(v-for='(position, index) in screen.positions' :key='index' :class='positionStatus(position)')
      td.selected
        .sign(v-if='positionSelected(index)') &#43;
      td.letter {{ indexLetter(index) }}
      td.separator &mdash;
      td.name {{ position.item.name }} ({{ position.count }})
      td.weight &#91;{{ position.item.weight }}kg&#93;
</template>

<script lang='ts'>
import Vue from 'vue'

const LETTER_OFFSET = 97

export default Vue.extend({
  name: 'Inventory',
  props: ['screen'],
  data() {
    return {
      page: 0,
      perPage: 20,
      selected: [],
    }
  },
  computed: {
    player() {
      return this.screen.player
    },
    carryingWeight() {
      let weight = Math.round(this.player.stuffWeight.current * 100) / 100
      return `Нагрузка ${weight} из ${this.player.carryingCapacity.stressed}`
    }
  },
  methods: {
    onEvent(event) {
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
      if (i >= 0 && i < Math.min(this.perPage, this.screen.positions.length)) {
        if (this.screen.singleItemMode) {
          this.screen.withItem(this.screen.positions[i])
        } else if (this.selected.indexOf(i) >= 0) {
          this.selected.splice(this.selected.indexOf(i), 1)
        } else {
          this.selected.push(i)
        }
      }
    },
    indexLetter(i: number): string {
      return String.fromCharCode(LETTER_OFFSET + i)
    },
    positionSelected(index) {
      return this.selected.indexOf(index) >= 0
    },
    positionStatus(position) {
      if (!position.item) {
        return ''
      } else {
        return 'text-success'
      }
    }
  }
})
</script>

<style lang="scss">
.positions-list {
  table-layout: fixed;

  td {
    width: 1%;
    white-space: nowrap;
  }

  .selected {
    padding-right: 1rem;
    width: 3rem;

    > .sign {
      position: absolute;
    }

    &::after {
      content: " ";
      white-space: pre;
    }
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

  .weight {
    width: 10%;
    text-align: right;
  }
}
</style>
