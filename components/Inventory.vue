<template>
  <div>
    <h3>Инвентарь</h3>

    <table v-if='false'>
      <tr v-for='wearing in player.inventory.wears()' :key='wearing.bodyPart.id'>
        <td>
          {{ displayBodyPart(wearing.bodyPart) }}
        </td>
        <td v-if='wearing.equipment'>
          {{ displayItem(wearing.equipment.item) }} {{ wearing.equipment.count }}
        </td>
      </tr>
    </table>

    <table>
      <tr v-for='(position, index) in screen.positions' :key='index'>
        <td>
          <strong>{{ indexLetter(index) }}</strong>
        </td>
        <td>
          {{ position }}
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

  InventoryInputKey,
} from '../src/engine'

import {
  displayItem,
} from './scene_tiles'

export default Vue.extend({
  name: 'Inventory',
  props: ['screen'],
  data() {
    return {
      page: 0,
    }
  },
  computed: {
    player() {
      return this.screen.player
    }
  },
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event) {
      switch (event.key) {
      case 'Escape':
        return this.close(InventoryInputKey.Close)
      }
    },
    indexLetter(i: number): string {
      return String.fromCharCode(97 + i)
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
    }
  }
})
</script>

