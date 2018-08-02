<template>
  <div>
    <p class='title'>Инвентарь</p>

    <table class='inventory-list'>
      <tr v-for='(position, index) in screen.positions' :key='index'>
        <td class='slot'>
          <span class='letter'>
            {{ indexLetter(index) }}
          </span>
          <span class='separator'>
            &#8212;
          </span>
          <span class='part'>
            {{ displayBodyPart(position.bodyPart) }}
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
} from '../src/engine'

import {
  displayItem,
} from './scene_tiles'

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
        if (this.screen.positions[i].equipment) {
          this.screen.takeOff(this.screen.positions[i])
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
      if (position.equipment) {
        return position.equipment.item.name
      } else {
        return '-'
      }
    },
    itemWeight(position) {
      if (position.equipment) {
        return `[${position.equipment.item.weight}g]`
      }
    }
  }
})
</script>

<style lang="scss">
.title {
  text-align: center;
}

.inventory-list {
  width: 100%;
  table-layout: fixed;
  white-space: nowrap;
  background: black;

  .slot {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: 15%;
    color: orange;

    .letter {
      color: yellow;
    }
  }

  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: 70%;
    color: white;
  }

  .weight {
    text-align: right;
    width: 5%;
    color: white;
  }
}
</style>

