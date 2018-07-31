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
      В сумке
    </dd>
    <dt class='col-sm-8'>
      <ul>
        <li v-for='invItem in creature.inventory.cares()' :key='invItem.id'>
            {{invItem.item.name}} {{ invItem.count === 1 ? '' : `: ${invItem.count}` }}
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
    displayAttribute(attribute) {
      if (attribute.currentValue() != attribute.maximum()) {
        return `${attribute.currentValue()} [${attribute.maximum()}]`
      } else {
        return attribute.currentValue()
      }
    },
    displayAttributeWithModifiers(attribute) {
      if (attribute.currentValue() != attribute.maximum()) {
        const mods = attribute.modifiers.map(x => x > 0 ? `+ ${x}` : `- ${x}`).join(' ')
        return `${attribute.currentValue()} = [${attribute.maximum()}] ${mods}`
      } else {
        return attribute.currentValue()
      }
    }
  }
})
</script>
