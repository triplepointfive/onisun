import { concat, cloneDeep } from 'lodash'
import { Game, GroupedItem, Inventory, LevelMap, PlayerAI } from '../../engine'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent } from '../events/internal'
import { Level } from '../lib/level'
import { CapacityLimitStat, Stat, StrengthStat } from '../lib/stat'
import { Item, Missile, Protection, ProtectionType } from './item'
import { Damage } from '../lib/damage'
import { Profession } from './profession'
import { Specie, Resistance } from './specie'
import { Creature, Reaction } from './creature'

export class Player extends Creature {
  public professions: Profession[] = []
  public inventory: Inventory = new Inventory()

  public itemsProtections: Protection[] = []
  public itemsDamages: Damage[] = []
  public itemsResistances: Resistance[] = []

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  // Main attributes
  public strength: StrengthStat
  public dexterity: Stat
  public constitution: Stat
  public intelligence: Stat
  public wisdom: Stat
  public charisma: Stat

  constructor(
    public level: Level,
    public ai: PlayerAI,
    specie: Specie,
    strengthValue: number,
    constitutionValue: number
  ) {
    super(specie)

    this.strength = new StrengthStat(strengthValue)
    this.dexterity = new Stat(2)
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

  get throwDamages(): Damage[] {
    // TODO: Add missile and missile weapons damages
    return this.specie.throwingDamages
  }

  get damages(): Damage[] {
    const strengthAdjustment = this.strength.meleeAdjustment

    return concat(this.specie.damages, this.itemsDamages).map(
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
}
