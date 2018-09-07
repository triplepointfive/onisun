import { includes } from 'lodash'
import { Game, GroupedItem, ImpactBunch, LevelMap, Memory } from '../../engine'
import { MetaAI } from '../ai/meta_ai'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent } from '../events/internal'
import { ItemsBunch } from '../lib/bunch'
import { ImpactType } from '../lib/impact'
import { buildFov } from '../lib/map_fov'
import { HealthStat } from '../lib/stat'
import { Item, Missile, Protection } from './items'
import { Damage } from '../lib/damage'
import { Specie, Resistance } from './specie'

export enum Clan {
  Player,
  PlayerOnlyEnemy,
  FreeForAll,
}

export enum Ability {
  GoStairwayDown,
  Inventory,
  PutOn,
  Throwing,
}

export const allAbilities = [
  Ability.GoStairwayDown,
  Ability.Inventory,
  Ability.PutOn,
  Ability.Throwing,
]

export type CreatureId = number

export enum Reaction {
  DIE,
  HURT,
  DODGE,
  THROW_DODGE,
  NOTHING,
  RESIST,
}

export abstract class Creature {
  private static lastId: CreatureId = 0
  public static getId(): CreatureId {
    return this.lastId++
  }

  protected stageMemories: { [key: string]: Memory } = {}

  public dead: boolean = false

  public health: HealthStat

  constructor(public specie: Specie, public id: CreatureId = Creature.getId()) {
    this.health = new HealthStat(specie)
  }

  get name(): string {
    return this.specie.name
  }

  get clan(): Clan {
    return this.specie.clan
  }

  get protections(): Protection[] {
    return this.specie.protections
  }

  get damages(): Damage[] {
    return this.specie.damages
  }

  public can(ability: Ability) {
    return includes(this.specie.abilities, ability)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectCreature(this)
  }

  get speed(): number {
    return this.specie.moveSpeed
  }

  public stageMemory(levelMap: LevelMap): Memory {
    return this.stageMemories[levelMap.id]
  }

  public visionMask(levelMap: LevelMap): void {
    let memory = this.stageMemory(levelMap)

    if (memory) {
      memory.resetVisible()
    } else {
      this.stageMemories[levelMap.id] = memory = new Memory(
        levelMap.width,
        levelMap.height
      )
    }

    buildFov(levelMap.creaturePos(this), this.visionRadius, memory, levelMap)
  }

  public abstract act(levelMap: LevelMap, game: Game): number

  private _impactsBunch: ImpactBunch | undefined

  get impactsBunch(): ImpactBunch {
    if (!this._impactsBunch) {
      this._impactsBunch = new ImpactBunch()
    }

    return this._impactsBunch
  }

  public hasImpact(type: ImpactType): boolean {
    return includes(this.impacts, type)
  }

  public addImpact(type: ImpactType, effect: string): void {
    this.impactsBunch.addConstImpact(type, effect)
  }

  public removeImpact(type: ImpactType, effect: string): void {
    this.impactsBunch.removeConstImpact(type, effect)
  }

  get visionRadius(): number {
    return this.specie.visionRadius
  }

  get bodyControl(): number {
    return this.specie.bodyControl
  }

  get impacts(): ImpactType[] {
    return this.impactsBunch.activeImpacts
  }

  public hasResistance(resistance: Resistance): boolean {
    return includes(this.resistances, resistance)
  }

  get resistances(): Resistance[] {
    return this.specie.resistances
  }

  abstract get missile(): GroupedItem<Missile> | undefined
  abstract get inventoryItems(): GroupedItem<Item>[]

  public abstract addItem(item: Item, count: number): void
  public abstract removeItem(item: Item, count: number): void

  protected statsTurn(): void {
    this.health.turn()

    if (this._impactsBunch) {
      // TODO: When ran out - disappear
      this._impactsBunch.turn()
    }
  }
}

export class AICreature extends Creature {
  private bag?: ItemsBunch<Item>

  constructor(
    public ai: MetaAI,
    specie: Specie,
    id: CreatureId = Creature.getId()
  ) {
    super(specie, id)
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

  get missile(): GroupedItem<Missile> | undefined {
    // TODO: Remove perpetuum items?
    if (this.specie.throwingItem) {
      return { item: this.specie.throwingItem, count: 1 }
    }
  }

  get inventoryItems(): GroupedItem<Item>[] {
    return this.bag ? this.bag.bunch : []
  }

  public addItem(item: Item, count: number): void {
    if (!this.bag) {
      this.bag = new ItemsBunch()
    }

    this.bag.put(item, count)
  }

  public removeItem(item: Item, count: number): void {
    if (!this.bag) {
      throw `Creature ${this.name} tried to remove item ${
        item.name
      } but it does not present`
    }

    this.bag.remove(item, count)
  }
}
