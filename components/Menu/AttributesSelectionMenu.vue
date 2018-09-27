<template lang="pug">
.content
  .subtitle Choose your attributes:

  table
    thead
      tr.attribute-row.-head
        th
        th.name {{ 'name' | t('presenters.primaryAttributeSelection') }}
        th.racial {{ 'racial' | t('presenters.primaryAttributeSelection') }}
        th.gender {{ 'gender' | t('presenters.primaryAttributeSelection') }}
        th.base {{ 'base' | t('presenters.primaryAttributeSelection') }}
        th.selected {{ 'selected' | t('presenters.primaryAttributeSelection') }}
        th.total {{ 'total' | t('presenters.primaryAttributeSelection') }}
    tbody
      tr.attribute-row(v-for='(name, index) in attributeNames')
        th.key
          | [
          .key {{ keys(index) }}
          | ]
        td.name {{ name | t('primaryAttributes') }}
        td.racial {{ menu.racialAttributes[name] }}
        td.gender {{ attributeModifier(menu.genderAttributes[name]) }}
        td.base {{ menu.baseAttributes[name] }}
        td.selected
          a.select-button.float-left(
            :class='{ "invisible": !canDecrease(name) }'
            @click='decrease(name)'
            )
            | -
          | {{ attributeModifier(selectedAttributes[name]) }}
          a.select-button.float-right(
            :class='{ "invisible": !canIncrease(name) }'
            @click='increase(name)'
            )
            | +
        td.total {{ totalAttribute(name) }}
  .points.mt-3
    |  {{ 'points' | t('presenters.primaryAttributeSelection', '', { points: points }) }}

  .menu-options
    MenuOption(char='R' :name="needConfirmation ? 'Confirm' : 'Ready'")
    MenuOption(char='*' name='Random' :separator='true')
    MenuOption(char='=' name='Back')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

import { PrimaryAttributes, randomizeAttributes } from 'src/onisun'

export default Vue.extend({
  name: 'AttributesSelectionMenu',
  props: ['menu'],
  data() {
    return {
      needConfirmation: false,
      points: this.menu.points,
      selectedAttributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      } as PrimaryAttributes,
      attributeNames: this.menu.attributeNames
    }
  },
  components: {
    MenuOption
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key) {
        case 'a':
          return this.decrease(this.attributeNames[0])
        case 'A':
          return this.increase(this.attributeNames[0])

        case 'b':
          return this.decrease(this.attributeNames[1])
        case 'B':
          return this.increase(this.attributeNames[1])

        case 'c':
          return this.decrease(this.attributeNames[2])
        case 'C':
          return this.increase(this.attributeNames[2])

        case 'd':
          return this.decrease(this.attributeNames[3])
        case 'D':
          return this.increase(this.attributeNames[3])

        case 'e':
          return this.decrease(this.attributeNames[4])
        case 'E':
          return this.increase(this.attributeNames[4])

        case 'f':
          return this.decrease(this.attributeNames[5])
        case 'F':
          return this.increase(this.attributeNames[5])

        case '*':
          [this.selectedAttributes, this.points] = randomizeAttributes(this.menu.baseAttributes, this.menu.points)
          return

        case 'R':
        case 'r':
          if (this.needConfirmation) {
            return this.menu.ready(this.totalAttribute)
          } else {
            this.needConfirmation = true
            return
          }
        case '=':
          return this.menu.back()
      }
    },
    attributeModifier(attribute: number): string {
      if (attribute === 0) {
        return '–'
      } else if (attribute > 0) {
        return `+${attribute}`
      } else {
        return attribute.toString()
      }
    },
    keys(index: number): string {
      return [
        'aA',
        'bB',
        'cC',
        'dD',
        'eE',
        'fF',
      ][index]
    },
    totalAttribute(attributeName: string): number {
      return this.menu.baseAttributes[attributeName] + this.selectedAttributes[attributeName]
    },
    canDecrease(attributeName: string): boolean {
      return this.selectedAttributes[attributeName] > 0
    },
    canIncrease(attributeName: string): boolean {
      return this.points >= this.totalAttribute(attributeName)
    },
    increase(attributeName: string) {
      this.needConfirmation = false

      if (this.canIncrease(attributeName)) {
        this.points -= this.totalAttribute(attributeName)
        this.selectedAttributes[attributeName] += 1
      }
    },
    decrease(attributeName: string) {
      this.needConfirmation = false

      if (this.canDecrease(attributeName)) {
        this.selectedAttributes[attributeName] -= 1
        this.points += this.totalAttribute(attributeName)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.attribute-row {
  &.-head {
    margin: 1rem;
    border-bottom: 1px solid white;
  }

  > .key {
    color: white;

    .key {
      color: gold;
      display: inline;
    }
  }

  .name {
    color: gold;
    text-align: left;
    width: 100%;
  }

  .base {
    color: gold;
  }

  .racial {
    color: greenyellow;
  }

  .gender {
    color: lightskyblue;
  }

  .selected {
    color: pink;
    user-select: none;
  }

  .total {
    color: white;
  }

  > td, th {
    padding: 0 0.5rem;
    text-align: center;
  }
}

.points {
  color: white;
}

tbody:before {
  content: '-';
  display: block;
  line-height: 0.5em;
  color: transparent;
}

.select-button {
  border: 1px solid pink;
  border-radius: 0.5rem;
  color: pink !important;
  cursor: pointer;
  padding: 0 5px 3px 5px;

  &:hover {
    background-color: deeppink;
    border-color: deeppink;

    text-decoration: none;
    outline: none;
  }

  &:focus {
    outline: 0;
  }
}
</style>
