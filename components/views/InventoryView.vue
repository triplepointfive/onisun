<template lang='pug'>
.screen-modal
  .h4.title Инвентарь
  .subtitle.my-3(v-text='carryingWeight')

  table.content.inventory-list
    tr(v-for='(position, index) in screen.positions' :key='index' :class='availableStatus(position)')
      td.slot
        span.letter {{ indexLetter(index) }}
        span.dash &#8212;
        span.part {{ displayBodyPart(position.inventorySlot) }}
        span.separator &#58;
      td.name-slot
        .name(:class='positionStatus(position)') {{ itemName(position) }}
        small.details(v-text='positionDetails(position)')
      td.weight {{ itemWeight(position) }}
</template>

<script lang='ts'>
import Vue from 'vue'
import {
  LeftHandSlot,
  RightHandSlot,
  BodySlot,
  MissileSlot,
  MissileWeaponSlot,
  InventoryPresenterPosition,
  Item,
  Player,
  Weapon,
  Armor,
  Damage,
  DamageType,
  Protection,
  ProtectionType,
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
    player(): Player {
      return this.screen.player
    },
    carryingWeight() {
      let weight = Math.round(this.player.stuffWeight.current * 100) / 100
      return `Нагрузка ${weight} из ${this.player.carryingCapacity.stressed}`
    }
  },
  methods: {
    onEvent(event: KeyboardEvent): void {
      switch (event.key) {
      case ' ':
      case 'Escape':
        return this.screen.close()
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
          this.screen.putOn(position)
        }
      }
    },
    indexLetter(i: number): string {
      return String.fromCharCode(LETTER_OFFSET + i)
    },
    positionStatus(position: InventoryPresenterPosition) {
      if (!position.item) {
        return ''
      } else {
        return 'text-success'
      }
    },
    // TODO: Move this to module
    positionDetails(position: InventoryPresenterPosition): string  | undefined {
      if (!position.item || !position.item.canSeeDetails) {
        return
      }

      if (position.item instanceof Weapon) {
        return position.item.damages.map(this.showDamage).join(',')
      } else if (position.item instanceof Armor) {
        return position.item.protections.map(this.showProtection).join(',')
      }

      return
    },
    showDamage({ extra, dice: { times, max }, type }: Damage): string {
      let base = `${this.showDamageType(type)} ${times}d${max}`

      if (extra) {
        base += `+${extra}`
      }

      return base
    },
    showDamageType(damageType: DamageType): string {
      switch (damageType) {
      case DamageType.Melee:
        return 'Me'
      case DamageType.Pierce:
        return 'Pi'
      case DamageType.Blunt:
        return 'B'
      case DamageType.Magic:
        return 'Mg'
      case DamageType.Pure:
        return 'Pu'
      default:
        return 'unknown damage type'
      }
    },
    showProtection({ type, value } : Protection): string {
      switch (type) {
      case ProtectionType.Light:
        return `L${value}`
      case ProtectionType.Medium:
        return `M${value}`
      case ProtectionType.Heavy:
        return `H${value}`
      case ProtectionType.Solid:
        return `S${value}`
      case ProtectionType.Unarmored:
        return `U${value}`
      default:
        return 'unknown protection type'
      }
    },
    displayBodyPart(bodyPart: BodySlot): string {
      return bodyPart.name
    },
    displayItem(item: Item): string | undefined {
      if (item) {
        return `${displayItem(item).getChar()} ${item.name}`
      }
    },
    itemName(position: InventoryPresenterPosition) {
      if (position.item && position.count) {
        return `${position.item.name} ${position.count > 1 ? `(${position.count})` : ''}`
      } else {
        return '-'
      }
    },
    itemWeight(position: InventoryPresenterPosition) {
      if (position.item && position.count) {
        return `[${position.item.weight * position.count}kg]`
      }
    },
    available(position: InventoryPresenterPosition) {
      return position.item || position.availableItems.length
    },
    availableStatus(position: InventoryPresenterPosition) {
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
    padding-right: 0.5rem;
    position: relative;

    vertical-align: top;

    .separator {
      position: absolute;
      right: 0;
    }

    .dash {
      padding: 0.5rem;
    }
  }

  .name-slot {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: 70%;

    > .details {
      color: grey;
    }
  }

  .weight {
    text-align: right;
    color: white;
  }
}
</style>
