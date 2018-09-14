import { concat, cloneDeep } from 'lodash'
import { Game, GroupedItem, Inventory, LevelMap, PlayerAI } from '../../engine'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent } from '../events/internal'
import { Level } from '../lib/level'
import {
  CapacityLimitStat,
  Stat,
  StrengthStat,
  DexterityStat,
} from '../lib/stat'
import { Item, Missile, Protection, ProtectionType } from './item'
import { Damage } from '../lib/damage'
import { Profession } from './profession'
import { Specie, Resistance } from './specie'
import { Creature, Reaction } from './creature'

export class Player extends Creature {
  public professions: Profession[] = []
  public inventory: Inventory = new Inventory()

  public itemsProtections: Protection[] = []
  public itemsResistances: Resistance[] = []

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  // Main attributes
  public strength: StrengthStat
  public dexterity: DexterityStat
  public constitution: Stat
  public intelligence: Stat
  public wisdom: Stat
  public charisma: Stat

  constructor(
    public level: Level,
    public ai: PlayerAI,
    specie: Specie,
    strengthValue: number,
    dexterityValue: number,
    constitutionValue: number
  ) {
    super(specie)

    this.strength = new StrengthStat(strengthValue)
    this.dexterity = new DexterityStat(dexterityValue)
    this.constitution = new Stat(constitutionValue)
    this.intelligence = new Stat(10)
    this.wisdom = new Stat(2)
    this.charisma = new Stat(2)

    this.stuffWeight = new Stat(0)
    this.carryingCapacity = new CapacityLimitStat(
      this.strength.current,
      this.constitution.current
    )
  }

  public act(levelMap: LevelMap, game: Game): number {
    this.statsTurn()
    this.visionMask(levelMap)

    const command = this.ai.act(this, levelMap, game)
    if (command) {
      this.on(command)
    }
    this.on(new AfterEvent(levelMap, game))

    return this.speed
  }

  public rebuildVision(levelMap: LevelMap): void {
    this.visionMask(levelMap)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectPlayer(this)
  }

  get missile(): GroupedItem<Missile> | undefined {
    // TODO: Validate item on slot
    return this.inventory.missileSlot.equipment
  }

  get inventoryItems(): GroupedItem<Item>[] {
    return this.inventory.allItems
  }

  public addItem(item: Item, count: number): void {
    this.inventory.putToBag(item, count)
  }

  public removeItem(item: Item, count: number): void {
    this.inventory.removeFromBag(item, count)
  }

  get bodyControl(): number {
    return this.specie.bodyControl + this.dexterity.bodyControlAdjustment
  }

  get throwDamages(): Damage[] {
    const dexterityAdjustment = this.dexterity.missileAdjustment

    return concat(this.specie.throwingDamages, this.missileItemsDamages()).map(
      (damage: Damage) => {
        let dmg = cloneDeep(damage)
        dmg.extra += dexterityAdjustment
        return dmg
      }
    )
  }

  get damages(): Damage[] {
    const strengthAdjustment = this.strength.meleeAdjustment

    return concat(this.specie.damages, this.meleeItemsDamages()).map(
      (damage: Damage) => {
        let dmg = cloneDeep(damage)
        dmg.extra += strengthAdjustment
        return dmg
      }
    )
  }

  get protections(): Protection[] {
    const perEmptySlotArmor = 1
    return concat(this.specie.protections, this.itemsProtections, [
      {
        type: ProtectionType.Unarmored,
        value: perEmptySlotArmor * this.inventory.unarmoredSlotsCount,
      },
    ])
  }

  get resistances(): Resistance[] {
    return concat(this.specie.resistances, this.itemsResistances)
  }

  protected meleeItemsDamages(): Damage[] {
    const rightHandEq = this.inventory.rightHandSlot.equipment,
      leftHandEq = this.inventory.leftHandSlot.equipment

    // TODO: Default damage
    return concat(
      rightHandEq ? rightHandEq.item.damages : [],
      leftHandEq ? leftHandEq.item.damages : []
    )
  }

  protected missileItemsDamages(): Damage[] {
    const missileEq = this.inventory.missileSlot.equipment,
      missileWeaponEq = this.inventory.missileWeaponSlot.equipment

    // TODO: Default damage
    return concat(
      // Can throw literally anything, so damage might be undefined
      missileEq ? missileEq.item.damages || [] : [],
      missileWeaponEq ? missileWeaponEq.item.damages : []
    )
  }
}
