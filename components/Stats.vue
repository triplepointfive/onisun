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
      Level
    </dd>
    <dt class='col-sm-8'>
      {{ creature.level.current }} [{{ creature.level.currentExperience }} - {{ creature.level.requiredExperience }}]
    </dt>

    <dd class='col-sm-4'>
      Здоровье
    </dd>
    <dt class='col-sm-8'>
      {{ displayAttribute(creature.characteristics.health) }}
    </dt>

    <dd class='col-sm-4'>
      Атака
    </dd>
    <dt class='col-sm-8'>
      {{ displayAttributeWithModifiers(creature.characteristics.attack) }}
    </dt>

    <dd class='col-sm-4'>
      Защита
    </dd>
    <dt class='col-sm-8'>
      {{ displayAttributeWithModifiers(creature.characteristics.defense) }}
    </dt>

    <dd class='col-sm-4'>
      Скорость
    </dd>
    <dt class='col-sm-8'>
      {{ displayAttributeWithModifiers(creature.characteristics.speed) }}
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
        <li v-for='(count, name) in groupedCares(creature.inventory.cares())' :key='name'>
            {{name}} {{ count === 1 ? '' : `: ${count}` }}
        </li>
      </ul>
    </dt>

    <dd class='col-sm-4'>
      Профессии
    </dd>
    <dt class='col-sm-8'>
      <ul>
        <li v-for='profession in creature.professions' :key='profession.name'>
            {{profession.name}} {{profession.level}}
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
  LeftHandSlot,
  RightHandSlot,
  BodySlot,
  MissileSlot,

  Patrol,
  Explorer,
  Waiter,
  Chaser,
  Escaper,
  Loiter,
  Dispatcher,
  Picker,
  SelfHealer,
  Attacker,
  Thrower,
} from '../src/engine'

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
        return `Loiter`
      }
      if (ai instanceof Dispatcher) {
        return `Dispatcher (${this.aiName(ai.aiToRun)})`
      }
      if (ai instanceof Attacker) {
        return `Attacker`
      }
      if (ai instanceof SelfHealer) {
        return `SelfHealer`
      }
      if (ai instanceof Picker) {
        return 'Picker'
      }
      if (ai instanceof Thrower) {
        return 'Thrower'
      }
    },
    displayItem(item) {
      if (item) {
        return `${displayItem(item).getChar()} ${item.name}`
      }
    },
    displayAttribute(attribute) {
      if (attribute.currentValue() != attribute.maximum()) {
        return `${attribute.currentValue()} [${attribute.maximum()}]`
      } else {
        return attribute.currentValue()
      }
    },
    displayAttributeWithModifiers(attribute) {
      if (attribute.currentValue() != attribute.maximum()) {
        const mods = attribute.modifiers.map(x => x > 0 ? `+ ${x}` : `- ${x}`)
        return `${attribute.currentValue()} = [${attribute.maximum()}] ${mods}`
      } else {
        return attribute.currentValue()
      }
    },
    groupedCares(cares) {
      let grouped = {}

      cares.forEach(item => {
        if (grouped[item.name]) {
          grouped[item.name] += 1
        } else {
          grouped[item.name] = 1
        }
      })

      return grouped
    },
    displayBodyPart(bodyPart) {
      switch (bodyPart) {
        case LeftHandSlot:
          return 'Левая рука'
        case RightHandSlot:
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
        case BodySlot:
          return 'Корпус'
        // case BodyPart.MissileWeapon:
        //   return 'MissileWeapon'
        case MissileSlot:
          return 'Снаряды'
        default:
          throw `Unknow body part ${bodyPart}`
      }
    }
  }
})
</script>
