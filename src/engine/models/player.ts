import { concat } from 'lodash'
import {
  Characteristics,
  Game,
  GroupedItem,
  Inventory,
  LevelMap,
  PlayerAI,
} from '../../engine'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent } from '../events/internal'
import { Level } from '../lib/level'
import { CapacityLimitStat, Stat } from '../lib/stat'
import { Damage, Item, Missile, Protection, ProtectionType } from './items'
import { Profession } from './profession'
import { Specie } from './specie'
import { Creature, Reaction } from './creature'

export class Player extends Creature {
  public professions: Profession[] = []
  public inventory: Inventory = new Inventory()
  public itemsProtections: Protection[] = []
  public itemsDamages: Damage[] = []

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  // Main attributes
  public strength: Stat
  public constitution: Stat

  constructor(
    public level: Level,
    characteristics: Characteristics,
    public ai: PlayerAI,
    specie: Specie,
    strengthValue: number,
    constitutionValue: number,
  ) {
    super(characteristics, specie)

    this.strength = new Stat(strengthValue)
    this.constitution = new Stat(constitutionValue)

    this.stuffWeight = new Stat(0)
    this.carryingCapacity = new CapacityLimitStat(this.strength.current, this.constitution.current)
  }

  public act(levelMap: LevelMap, game: Game): void {
    this.statsTurn()
    this.visionMask(levelMap)
    const command = this.ai.act(this, levelMap, game)
    if (command) {
      this.on(command)
    }
    this.on(new AfterEvent(levelMap, game))
  }

  public rebuildVision(levelMap: LevelMap): void {
    this.visionMask(levelMap)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectPlayer(this)
  }

  get missile(): GroupedItem<Missile> | undefined {
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

  get damages(): Damage[] {
    return concat(this.specie.damages, this.itemsDamages)
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
}
