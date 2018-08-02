<template>
  <div class='screen-modal'>
    <span class='title'>Инвентарь</span>

    <table class='content inventory-list'>
      <tr v-for='(position, index) in screen.positions' :key='index' :class='availableStatus(position)'>
        <td class='slot'>
          <span class='letter'>
            {{ indexLetter(index) }}
          </span>
          <span class='dash'>
            &#8212;
          </span>
          <span class='part'>
            {{ displayBodyPart(position.inventorySlot) }}
          </span>
          <span class='separator float-right'>
              &#58;
          </span>
        </td>
        <td class='name' :class='positionStatus(position)'>
          {{ itemName(position) }}
        </td>
        <td class='weight'>
          {{ itemWeight(position) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {
  LeftHandSlot,
  RightHandSlot,
  BodySlot,
  MissileSlot,
} from '../../src/engine'

import {
  displayItem,
} from './../scene_tiles'

const LETTER_OFFSET = 97

export default Vue.extend({
  name: 'Inventory',
  props: ['screen'],
  data() {
    return {
      page: 0,
      perPage: 20,
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
        const position = this.screen.positions[i]
        if (position.item) {
          this.screen.takeOff(position)
        } else if (position.availableItems.length) {
          console.log(position)
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
    },
    displayBodyPart(bodyPart) {
      switch (bodyPart.id) {
        case LeftHandSlot.id:
          return 'Левая рука'
        case RightHandSlot.id:
          return 'Правая рука'
        // case BodyPart.Legs:
        //   return '足'
        // case BodyPart.Finger:
        //   return '指'
        // case BodyPart.Head:
        //   return '頭'
        // case BodyPart.Eye:
        //   return '目'
        // case BodyPart.Neck:
        //   return '首'
        // case BodyPart.Back:
        //   return '背'
        case BodySlot.id:
          return 'Корпус'
        // case BodyPart.MissileWeapon:
        //   return 'MissileWeapon'
        case MissileSlot.id:
          return 'Снаряды'
        default:
          throw `Unknow body part ${bodyPart}`
      }
    },
    displayItem(item) {
      if (item) {
        return `${displayItem(item).getChar()} ${item.name}`
      }
    },
    itemName(position) {
      if (position.item) {
        return `${position.item.name} (${position.count})`
      } else {
        return '-'
      }
    },
    itemWeight(position) {
      if (position.item) {
        return `[${position.item.weight}g]`
      }
    },
    available(position) {
      return position.item || position.availableItems.length
    },
    availableStatus(position) {
      return this.available(position) ? '-available' : '-unavailable'
    }
  }
})
</script>

<style lang="scss">
.inventory-list {
  table-layout: fixed;
  white-space: nowrap;

  .-unavailable {
    color: grey !important;

    .slot {
      .letter, .dash {
        visibility: hidden;
      }
    }
  }

  .-available {
    .slot {
      color: orange;

      .letter {
        color: yellow;
      }
    }

    .name {
      color: white;
    }
  }

  .slot {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: 15%;
  }

  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: 70%;
  }

  .weight {
    text-align: right;
    width: 5%;
    color: white;
  }
}
</style>

