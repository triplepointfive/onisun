<template>
  <dl class='row small'>
    <dd class='col-sm-4'>
      ID
    </dd>
    <dt class='col-sm-8'>
      {{ creature.id }}
    </dt>

    <dd class='col-sm-4'>
      POS
    </dd>
    <dt class='col-sm-8'>
      {{ creature.pos }}
    </dt>

    <dd class='col-sm-4'>
      健康
    </dd>
    <dt class='col-sm-8'>
      {{ creature.health }}
    </dt>

    <dd class='col-sm-4'>
      Атака
    </dd>
    <dt class='col-sm-8'>
      {{ creature.characteristics.attack.currentValue() }}
    </dt>

    <dd class='col-sm-4'>
      Защита
    </dd>
    <dt class='col-sm-8'>
      {{ creature.characteristics.defense.currentValue() }}
    </dt>

    <dd class='col-sm-4'>
      Initiation
    </dd>
    <dt class='col-sm-8'>
      {{ creature.initiativity() }}
    </dt>

    <dd class='col-sm-4'>
      AI
    </dd>
    <dt class='col-sm-8'>
      {{ aiName(creature.ai) }}
    </dt>

    <dd class='col-sm-4'>
      服
    </dd>
    <dt class='col-sm-8'>
      <table>
        <tr v-for='(wearing, i) in creature.inventory.wears()' :key='"bodyPart" + i'>
          <td>
            {{ displayBodyPart(wearing.bodyPart) }}
          </td>
          <td>
            {{ displayItem(wearing.equipment) }}
          </td>
        </tr>
      </table>
    </dt>

    <dd class='col-sm-4'>
      鞄
    </dd>
    <dt class='col-sm-8'>
      <ul>
        <li v-for='item in creature.inventory.cares()' :key='item.id'>
            {{ displayItem(item) }}
        </li>
      </ul>
    </dt>
  </dl>
</template>

<script lang="ts">
import Vue from 'vue'

import {
  displayItem,
} from './scene_tiles'

import {
  Patrol,
  Explorer,
  Waiter,
  Chaser,
  Escaper,
  Loiter,
  Dispatcher,
  Picker,
} from '../ai'

import { BodyPart } from '../inventory'

export default Vue.extend({
  name: 'Stats',
  props: ['creature'],
  computed: {
  },
  methods: {
    aiName(ai) {
      if (ai instanceof Patrol) {
        return 'Patrol'
      }
      if (ai instanceof Escaper) {
        return 'Escaper'
      }
      if (ai instanceof Chaser) {
        return 'Chaser'
      }
      if (ai instanceof Explorer) {
        return 'Explorer'
      }
      if (ai instanceof Waiter) {
        return 'Waiter'
      }
      if (ai instanceof Loiter) {
        return `Loiter (${this.aiName(ai.prevAI)})`
      }
      if (ai instanceof Dispatcher) {
        return `Dispatcher (${this.aiName(ai.prevAI)})`
      }
      if (ai instanceof Picker) {
        return 'Picker'
      }
    },
    displayItem(item) {
      if (item) {
        return `${displayItem(item).getChar()} ${item.name}`
      }
    },
    displayBodyPart(bodyPart) {
      switch (bodyPart) {
        case BodyPart.LeftHand:
          return '手'
        case BodyPart.RightHand:
          return '手'
        case BodyPart.Legs:
          return '足'
        case BodyPart.Finger:
          return '指'
        case BodyPart.Head:
          return '頭'
        case BodyPart.Eye:
          return '目'
        case BodyPart.Neck:
          return '首'
        case BodyPart.Back:
          return '背'
        case BodyPart.Body:
          return '体'
        default:
          throw `Unknow body part ${bodyPart}`
      }
    }
  }
})
</script>