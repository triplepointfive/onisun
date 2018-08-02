<template>
  <div>
    <h3>Что поднять?</h3>
    <table class='positions-list'>
      <tr v-for='(position, index) in screen.positions' :key='index' :class='positionStatus(position)'>
        <td class='selected'>
          <div class='sign' v-if='positionSelected(index)'>
            &#43;
          </div>
        </td>
        <td class='letter'>
          {{ indexLetter(index) }}
        </td>
        <td class='separator'>
          &mdash;
        </td>
        <td class='name'>
          {{ position.item.name }} ({{ position.count }})
        </td>
        <td class='weight'>
          &#91;{{ position.item.weight }}g&#93;
        </td>
      </tr>
    </table>
  </div>
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
    }
  },
  methods: {
    onEvent(event) {
      switch (event.key) {
      case ' ':
      case 'Escape':
        return this.screen.close()
      case 'Enter':
      case ',':
        return this.screen.pickUpItems(this.selected.map(index => this.screen.positions[index]))
      default:
        return this.selectAt(event.key.charCodeAt(0) - LETTER_OFFSET)
      }
    },
    selectAt(i: number) {
      if (i >= 0 && i < Math.min(this.perPage, this.screen.positions.length)) {
        if (this.selected.indexOf(i) >= 0) {
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
  width: 100%;
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
    padding-left: 1rem;
    text-align: right;
  }
}
</style>
