<template lang='pug'>
.panel.container
  .level.cell
    .value {{ creature.level.current }}
    .note
      | Уровень
      .progress
        .progress-bar.bg-success(
          role="progressbar"
          :style='{ width: levelProgress }'
        )
  .hp.cell
    .value
      | {{ displayAttribute(creature.health) }}
    .bar(
      :style='{ height: healthLevel }'
      )

  PrimaryAttribute.attribute(
    slug='attack'
    name='А'
    full-name='Атака'
    :attr='creature.characteristics.attack'
    )
  PrimaryAttribute.attribute(
    slug='defense'
    name='З'
    full-name='Защита'
    :attr='creature.characteristics.defense'
    )
  PrimaryAttribute.attribute(
    slug='speed'
    name='С'
    full-name='Скорость'
    :attr='creature.characteristics.speed'
    )
  .cell
    .value {{ levelMap.name }}
  .cell
    .value {{ protections }}
  .cell
    .value {{ damages }}
</template>

<script lang="ts">
import Vue from 'vue'

import PrimaryAttribute from './PrimaryAttribute.vue'
import { Attribute, Level } from 'src/engine'

import {
  showProtection, showDamage
} from './shows'

export default Vue.extend({
  name: 'Stats',
  props: ['creature', 'levelMap'],
  components: {
    PrimaryAttribute
  },
  computed: {
    levelProgress(): string {
      const level: Level = this.creature.level
      return `${level.currentExperience  / level.requiredExperience * 100}%`
    },
    healthLevel(): string {
      const attribute: Attribute = this.creature.health
      return `${attribute.currentValue / (attribute.maximum || 0) * 100}%`
    },
    protections(): string {
      return this.creature.protections.map(showProtection).join(', ')
    },
    damages(): string {
      return this.creature.damages.map(showDamage).join(', ')
    }
  },
  methods: {
    displayAttribute(attribute: Attribute) {
      if (attribute.currentValue != attribute.maximum) {
        return `${attribute.currentValue} / ${attribute.maximum}`
      } else {
        return attribute.currentValue
      }
    },
  }
})
</script>

<style lang="scss" scoped>
$height: 100px;
$width: 100px;

.panel {
  border: 3px solid white;
  border-bottom: 0;

  border-radius: $height/2 $height/2 0 0;
  height: $height;

  padding: 0 $height / 2 0 $height / 2;
  background-color: black;
  color: white;

  .cell {
    display: inline-block;
    vertical-align: middle;

    border-width: 0 1px 0 1px;
    border-style: solid;
    border-color: white;

    text-align: center;
    height: $height;
    width: $width;
  }

  .attribute {
    display: inline-block;
    vertical-align: middle;

    border-width: 0 1px 0 1px;
    border-style: solid;
    border-color: white;

    text-align: center;
    height: $height;
    width: $width / 2;
  }
}

.level {
  position: relative;
  height: 100%;

  > .value {
    font-size: 3em;
  }

  > .note {
    line-height: 1;
    position: absolute;
    bottom: $height / 10;
    left: 50%;
    transform: translate(-50%);
    width: 90%;
  }
}

.hp {
  position: relative;

  background-color: red;

  > .value {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 11;

    font-size: 1rem;
    color: white;
  }

  > .bar {
    background-color: green;
    height: 50%;
    position: absolute;
    z-index: 10;
    width: 100%;
    bottom: 0;
  }
}
</style>
